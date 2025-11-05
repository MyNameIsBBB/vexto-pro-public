"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { setToken } from "@/lib/api";

export default function GoogleCallbackPage() {
    const params = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = params.get("token");
        const state = params.get("state");

        if (token) {
            setToken(token);
            // Redirect to state URL or edit page
            const redirectUrl = state ? decodeURIComponent(state) : "/edit";
            router.push(redirectUrl);
        } else {
            // No token, redirect to login
            router.push("/login?error=google-auth-failed");
        }
    }, [params, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-white/70">กำลังเข้าสู่ระบบด้วย Google...</p>
            </div>
        </div>
    );
}
