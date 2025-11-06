"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { api, setToken, getToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = getToken();
        if (token) {
            loadProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const loadProfile = async () => {
        try {
            const data = await api.get("/profiles/me/info");
            setProfile(data);
            // Set user with username and isPro from server
            setUser({
                id: data?.user?.id || data.userId,
                username: data?.user?.username || data.username,
                email: data?.user?.email,
                isPro: !!(data?.user?.isPro || data?.isPro),
            });
            console.log("Loaded user data:", {
                id: data?.user?.id || data.userId,
                username: data?.user?.username || data.username,
                email: data?.user?.email,
            });
            // Admin allowlist from ENV (comma separated usernames)
            const adminCsv = process.env.NEXT_PUBLIC_ADMIN_USERNAMES || "";
            const adminList = adminCsv
                .split(",")
                .map((s) => s.trim().toLowerCase())
                .filter(Boolean);
            let uiAdmin =
                !!data?.username &&
                adminList.includes(String(data.username).toLowerCase());
            // Server authority: try an admin-only endpoint to assert admin
            try {
                await api.get("/creators/submissions?status=pending");
                uiAdmin = true;
            } catch (_e) {
                // ignore, keep uiAdmin
            }
            setIsAdmin(uiAdmin);
        } catch (error) {
            console.error("Failed to load profile:", error);
            // Token might be invalid
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    };

    // emailOrUsername supported by backend
    const login = async (emailOrUsername, password) => {
        const data = await api.post("/auth/login", {
            emailOrUsername,
            password,
        });
        setToken(data.token);
        setUser({
            id: data?.user?.id,
            email: data?.user?.email,
            username: data?.user?.username,
        });
        await loadProfile();
        return data;
    };

    const register = async (email, password, username, displayName) => {
        const data = await api.post("/auth/register", {
            email,
            password,
            username,
            displayName,
        });
        setToken(data.token);
        setUser({
            id: data?.user?.id,
            email: data?.user?.email,
            username: data?.user?.username,
        });
        await loadProfile();
        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setProfile(null);
    };

    const updateProfile = async (profileData) => {
        const data = await api.put("/profiles/me", profileData);
        setProfile(data);
        return data;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                isAdmin,
                login,
                register,
                logout,
                updateProfile,
                loadProfile,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
