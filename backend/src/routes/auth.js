const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Profile = require("../models/Profile");
const auth = require("../middleware/auth");

const router = express.Router();

function signToken(userId) {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}

// Register
router.post("/register", async (req, res) => {
    try {
        const { email, username, password, displayName } = req.body;
        if (!email || !username || !password || !displayName) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const existingEmail = await User.findOne({
            email: email.toLowerCase(),
        });
        if (existingEmail)
            return res.status(400).json({ error: "Email already in use" });
        const existingUser = await User.findOne({
            username: username.toLowerCase(),
        });
        if (existingUser)
            return res.status(400).json({ error: "Username already taken" });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, username, passwordHash });

        // Create an initial profile
        await Profile.create({
            userId: user._id,
            username: user.username,
            displayName,
            avatarUrl: "",
            bio: "",
            theme: {
                mode: "dark",
                primary: "#7c3aed",
                background: "#0b1020",
                accent: "#22d3ee",
            },
            blocks: [
                {
                    id: "welcome",
                    type: "text",
                    props: { text: `สวัสดี! นี่คือโปรไฟล์ของ ${displayName}` },
                },
            ],
        });

        const token = signToken(user._id.toString());
        res.status(201).json({
            token,
            user: { id: user._id, email: user.email, username: user.username },
        });
    } catch (e) {
        console.error("Register error", e);
        res.status(500).json({ error: "Registration failed" });
    }
});

// Check username availability
router.get("/check-username/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const { currentUsername } = req.query; // สำหรับการเช็คเมื่อแก้ไข

        if (!username || username.length < 3) {
            return res.json({
                available: false,
                message: "Username ต้องมีอย่างน้อย 3 ตัวอักษร",
            });
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return res.json({
                available: false,
                message: "ใช้ได้เฉพาะตัวอักษร ตัวเลข _ และ - เท่านั้น",
            });
        }

        const existingUser = await User.findOne({
            username: username.toLowerCase(),
        });

        // ถ้าเป็น username เดิมของตัวเอง ให้ถือว่าใช้ได้
        if (
            currentUsername &&
            currentUsername.toLowerCase() === username.toLowerCase()
        ) {
            return res.json({
                available: true,
                message: "นี่คือ username ปัจจุบันของคุณ",
            });
        }

        if (existingUser) {
            return res.json({
                available: false,
                message: "Username นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น",
            });
        }

        res.json({ available: true, message: "Username ใช้งานได้" });
    } catch (e) {
        console.error("Check username error", e);
        res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password)
            return res.status(400).json({ error: "Missing credentials" });

        const query = emailOrUsername.includes("@")
            ? { email: emailOrUsername.toLowerCase() }
            : { username: emailOrUsername.toLowerCase() };

        const user = await User.findOne(query);
        if (!user)
            return res.status(400).json({ error: "Invalid credentials" });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(400).json({ error: "Invalid credentials" });

        const token = signToken(user._id.toString());
        res.json({
            token,
            user: { id: user._id, email: user.email, username: user.username },
        });
    } catch (e) {
        console.error("Login error", e);
        res.status(500).json({ error: "Login failed" });
    }
});

// Discord OAuth2
// Start OAuth: redirect user to Discord authorization URL
router.get("/discord/start", async (req, res) => {
    try {
        const clientId = process.env.DISCORD_CLIENT_ID;
        const redirectUri =
            req.query.redirect_uri || process.env.DISCORD_REDIRECT_URI;
        const scope = encodeURIComponent("identify email");
        const state = encodeURIComponent(req.query.state || "");
        if (!clientId || !redirectUri) {
            return res
                .status(500)
                .json({ error: "Discord OAuth not configured" });
        }
        const url =
            `https://discord.com/api/oauth2/authorize?response_type=code` +
            `&client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${scope}` +
            (state ? `&state=${state}` : "");
        res.redirect(url);
    } catch (e) {
        console.error("Discord start error", e);
        res.status(500).json({ error: "Failed to start Discord OAuth" });
    }
});

// Callback: exchange code, upsert user/profile, sign JWT, and return JSON
router.get("/discord/callback", async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) return res.status(400).json({ error: "Missing code" });
        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        const redirectUri =
            process.env.DISCORD_FRONTEND_REDIRECT ||
            "http://localhost:3000/auth/discord/callback";
        const frontendRedirect =
            process.env.DISCORD_FRONTEND_REDIRECT ||
            (process.env.FRONTEND_BASE_URL
                ? `${process.env.FRONTEND_BASE_URL}/auth/discord/callback`
                : null);
        if (!clientId || !clientSecret || !redirectUri) {
            return res
                .status(500)
                .json({ error: "Discord OAuth not configured" });
        }

        // Exchange code for token
        const params = new URLSearchParams();
        params.set("client_id", clientId);
        params.set("client_secret", clientSecret);
        params.set("grant_type", "authorization_code");
        params.set("code", code);
        params.set("redirect_uri", redirectUri);

        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
        });
        const tokenJson = await tokenRes.json();
        if (!tokenRes.ok) {
            console.error("Discord token error", tokenJson);
            return res.status(400).json({ error: "Token exchange failed" });
        }

        const accessToken = tokenJson.access_token;
        // Fetch Discord user
        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const discordUser = await userRes.json();
        if (!userRes.ok) {
            console.error("Discord user error", discordUser);
            return res.status(400).json({ error: "Failed to fetch user" });
        }

        // Upsert local user
        const email = (discordUser.email || "").toLowerCase();
        const usernameBase = (discordUser.username || "discord_user")
            .toLowerCase()
            .replace(/[^a-z0-9_\.\-]/g, "");

        let user = null;
        if (email) user = await User.findOne({ email });
        if (!user) user = await User.findOne({ username: usernameBase });

        if (!user) {
            const passwordHash = await bcrypt.hash(
                `discord:${discordUser.id}:${Date.now()}`,
                10
            );
            let uniqueUsername = usernameBase || `discord_${discordUser.id}`;
            let iter = 0;
            while (await User.findOne({ username: uniqueUsername })) {
                iter += 1;
                uniqueUsername = `${usernameBase}${iter}`;
            }
            user = await User.create({
                email: email || undefined,
                username: uniqueUsername,
                passwordHash,
            });

            // Create profile
            await Profile.create({
                userId: user._id,
                username: user.username,
                displayName: discordUser.global_name || discordUser.username,
                avatarUrl: discordUser.avatar
                    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
                    : "",
                bio: "",
                theme: {
                    mode: "dark",
                    primary: "#7c3aed",
                    background: "#0b1020",
                    outerBackground: "#0b1020",
                    accent: "#22d3ee",
                },
                blocks: [],
            });
        } else {
            // Ensure profile exists for existing user
            const existingProfile = await Profile.findOne({ userId: user._id });
            if (!existingProfile) {
                await Profile.create({
                    userId: user._id,
                    username: user.username,
                    displayName:
                        discordUser.global_name || discordUser.username,
                    avatarUrl: discordUser.avatar
                        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
                        : "",
                    bio: "",
                    theme: {
                        mode: "dark",
                        primary: "#7c3aed",
                        background: "#0b1020",
                        outerBackground: "#0b1020",
                        accent: "#22d3ee",
                    },
                    blocks: [],
                });
            }
        }

        const token = signToken(user._id.toString());

        // Return JSON instead of redirect for frontend to handle
        return res.json({
            token,
            user: { id: user._id, email: user.email, username: user.username },
        });
    } catch (e) {
        console.error("Discord callback error", e);
        return res.status(500).json({ error: "Discord OAuth failed" });
    }
});

// Google OAuth2
// Start OAuth: redirect user to Google authorization URL
router.get("/google/start", async (req, res) => {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri =
            req.query.redirect_uri || process.env.GOOGLE_REDIRECT_URI;

        if (!clientId || !redirectUri) {
            return res
                .status(500)
                .json({ error: "Google OAuth not configured" });
        }

        const authUrl =
            `https://accounts.google.com/o/oauth2/v2/auth?` +
            `response_type=code&` +
            `client_id=${encodeURIComponent(clientId)}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `scope=${encodeURIComponent("openid email profile")}&` +
            `access_type=offline&` +
            `prompt=consent`;
        res.redirect(authUrl);
    } catch (e) {
        console.error("Google start error", e);
        res.status(500).json({ error: "Failed to start Google OAuth" });
    }
});

// Handle Google OAuth callback
router.get("/google/callback", async (req, res) => {
    try {
        const { code, state } = req.query;

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri =
            process.env.GOOGLE_FRONTEND_REDIRECT ||
            "http://localhost:3000/auth/google/callback";

        if (!clientId || !clientSecret || !redirectUri) {
            return res
                .status(500)
                .json({ error: "Google OAuth not configured" });
        }

        if (!code) {
            return res.status(400).json({ error: "No code provided" });
        }

        // Exchange code for access token
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                grant_type: "authorization_code",
                redirect_uri: redirectUri,
            }),
        });
        const tokenJson = await tokenRes.json();

        console.log("Google token exchange response:", {
            status: tokenRes.status,
            ok: tokenRes.ok,
            data: tokenJson,
            redirectUri: redirectUri,
        });

        if (!tokenRes.ok || !tokenJson.access_token) {
            console.error("Google token error", tokenJson);
            return res.status(400).json({
                error: "Failed to get token",
                details:
                    tokenJson.error_description ||
                    tokenJson.error ||
                    "Unknown error",
            });
        }

        const accessToken = tokenJson.access_token;

        // Fetch Google user
        const userRes = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        const googleUser = await userRes.json();
        if (!userRes.ok) {
            console.error("Google user error", googleUser);
            return res.status(400).json({ error: "Failed to fetch user" });
        }

        // Upsert local user
        const email = (googleUser.email || "").toLowerCase();
        const usernameBase = (
            googleUser.name ||
            googleUser.email ||
            "google_user"
        )
            .toLowerCase()
            .replace(/[^a-z0-9_\.\-]/g, "")
            .substring(0, 20);

        let user = null;
        if (email) user = await User.findOne({ email });

        if (!user) {
            const passwordHash = await bcrypt.hash(
                `google:${googleUser.id}:${Date.now()}`,
                10
            );
            let uniqueUsername = usernameBase || `google_${googleUser.id}`;
            let iter = 0;
            while (await User.findOne({ username: uniqueUsername })) {
                iter += 1;
                uniqueUsername = `${usernameBase}${iter}`;
            }
            user = await User.create({
                email: email || undefined,
                username: uniqueUsername,
                passwordHash,
            });

            // Create profile
            await Profile.create({
                userId: user._id,
                username: user.username,
                displayName: googleUser.name || googleUser.email,
                avatarUrl: googleUser.picture || "",
                bio: "",
                theme: {
                    mode: "dark",
                    primary: "#7c3aed",
                    background: "#0b1020",
                    outerBackground: "#0b1020",
                    accent: "#22d3ee",
                },
                blocks: [],
            });
        } else {
            // Ensure profile exists for existing user
            const existingProfile = await Profile.findOne({ userId: user._id });
            if (!existingProfile) {
                await Profile.create({
                    userId: user._id,
                    username: user.username,
                    displayName: googleUser.name || googleUser.email,
                    avatarUrl: googleUser.picture || "",
                    bio: "",
                    theme: {
                        mode: "dark",
                        primary: "#7c3aed",
                        background: "#0b1020",
                        outerBackground: "#0b1020",
                        accent: "#22d3ee",
                    },
                    blocks: [],
                });
            }
        }

        const token = signToken(user._id.toString());

        // Return JSON instead of redirect for frontend to handle
        return res.json({
            token,
            user: { id: user._id, email: user.email, username: user.username },
        });
    } catch (e) {
        console.error("Google callback error", e);
        return res.status(500).json({ error: "Google OAuth failed" });
    }
});

// Change username (Pro only)
router.put("/username", auth, async (req, res) => {
    try {
        const { newUsername } = req.body;
        if (!newUsername || typeof newUsername !== "string") {
            return res.status(400).json({ error: "Invalid username" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check pro status
        if (!user.isPro && user.proTier === "free") {
            return res.status(403).json({
                error: "Pro subscription required to change username",
            });
        }

        // Check expiry
        if (user.proExpiry && new Date(user.proExpiry) < new Date()) {
            return res.status(403).json({
                error: "Pro subscription expired",
            });
        }

        const normalizedUsername = newUsername.toLowerCase().trim();

        // Validate username format
        if (!/^[a-z0-9_.-]+$/.test(normalizedUsername)) {
            return res.status(400).json({
                error: "Username can only contain letters, numbers, dots, dashes, and underscores",
            });
        }

        if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
            return res.status(400).json({
                error: "Username must be between 3 and 30 characters",
            });
        }

        // Check if username is taken
        const existing = await User.findOne({
            username: normalizedUsername,
            _id: { $ne: req.userId },
        });
        if (existing) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Update user
        user.username = normalizedUsername;
        await user.save();

        // Update profile
        await Profile.findOneAndUpdate(
            { userId: req.userId },
            { $set: { username: normalizedUsername } }
        );

        res.json({ ok: true, username: normalizedUsername });
    } catch (e) {
        console.error("Change username error", e);
        res.status(500).json({ error: "Failed to change username" });
    }
});

module.exports = router;
