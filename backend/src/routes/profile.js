const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Profile = require("../models/Profile");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { validateProfileUpdate } = require("../middleware/validation");

const router = express.Router();

// (moved to bottom) Public: get profile by username

// Auth: get my profile
router.get("/me/info", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.userId });
        if (!profile)
            return res.status(404).json({ error: "Profile not found" });
        const user = await User.findById(req.userId).select(
            "email username isPro isAdmin"
        );
        const obj = profile.toObject();
        // ถ้าเป็น admin ให้ isPro = true เลย
        const effectiveIsPro = user?.isAdmin || user?.isPro;
        return res.json({
            ...obj,
            isPro: !!effectiveIsPro,
            user: user
                ? {
                      id: String(user._id),
                      email: user.email,
                      username: user.username,
                      isPro: !!effectiveIsPro,
                      isAdmin: !!user.isAdmin,
                  }
                : undefined,
        });
    } catch (e) {
        console.error("Get my profile error", e);
        res.status(500).json({ error: "Failed to fetch my profile" });
    }
});

// Auth: upsert my profile
router.put("/me", auth, validateProfileUpdate, async (req, res) => {
    try {
        const { displayName, avatarUrl, bio, theme, blocks, isPublic, slug } =
            req.body;

        // Get user to check pro status
        const user = await User.findById(req.userId).select(
            "isPro isAdmin proTier proExpiry"
        );
        const isPro = user?.isAdmin || user?.isPro || false;
        const isProActive =
            user?.isAdmin ||
            (isPro &&
                (!user.proExpiry || new Date(user.proExpiry) > new Date()));

        // Free tier: limit blocks to 3
        let finalBlocks = blocks || [];
        if (!isProActive && finalBlocks.length > 3) {
            return res.status(403).json({
                error: "Free plan limited to 3 blocks. Upgrade to Pro for unlimited blocks.",
            });
        }

        // If slug provided, ensure not taken by others
        if (slug) {
            const existing = await Profile.findOne({
                slug: String(slug).toLowerCase().trim(),
                userId: { $ne: req.userId },
            });
            if (existing) {
                return res.status(400).json({ error: "Slug already taken" });
            }
        }

        const profile = await Profile.findOneAndUpdate(
            { userId: req.userId },
            {
                $set: {
                    displayName,
                    avatarUrl,
                    bio,
                    theme,
                    slug: slug ? String(slug).toLowerCase().trim() : undefined,
                    blocks: finalBlocks.map((b) => ({
                        id: b.id || uuidv4(),
                        type: b.type,
                        props: b.props || {},
                    })),
                    isPublic: typeof isPublic === "boolean" ? isPublic : true,
                },
            },
            { new: true, upsert: true }
        );
        res.json(profile);
    } catch (e) {
        console.error("Update profile error", e);
        if (e && e.code === 11000) {
            return res.status(400).json({ error: "Slug already taken" });
        }
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// Auth: update username (Pro only)
router.put("/me/username", auth, async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || username.length < 3) {
            return res
                .status(400)
                .json({ error: "Username ต้องมีอย่างน้อย 3 ตัวอักษร" });
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return res
                .status(400)
                .json({ error: "ใช้ได้เฉพาะตัวอักษร ตัวเลข _ และ - เท่านั้น" });
        }

        // Check Pro status
        const user = await User.findById(req.userId).select(
            "isPro isAdmin username"
        );
        const isPro = user?.isAdmin || user?.isPro || false;

        if (!isPro) {
            return res
                .status(403)
                .json({
                    error: "ต้องเป็นสมาชิก Pro ถึงจะเปลี่ยน username ได้",
                });
        }

        // Check if username is already taken
        const existingUser = await User.findOne({
            username: username.toLowerCase(),
            _id: { $ne: req.userId },
        });

        if (existingUser) {
            return res.status(400).json({ error: "Username นี้ถูกใช้งานแล้ว" });
        }

        // Update username in User
        user.username = username.toLowerCase();
        await user.save();

        // Update username in Profile
        await Profile.findOneAndUpdate(
            { userId: req.userId },
            { $set: { username: username.toLowerCase() } }
        );

        res.json({
            success: true,
            username: user.username,
            message: "เปลี่ยน username สำเร็จ",
        });
    } catch (e) {
        console.error("Update username error", e);
        res.status(500).json({ error: "Failed to update username" });
    }
});

// Public: get profile by username (must be last)
router.get("/:handle", async (req, res) => {
    try {
        const handle = req.params.handle.toLowerCase();
        const profile = await Profile.findOne({
            $and: [
                {
                    $or: [{ username: handle }, { slug: handle }],
                },
                { isPublic: true },
            ],
        });
        if (!profile)
            return res.status(404).json({ error: "Profile not found" });
        const user = await User.findById(profile.userId).select(
            "isPro isAdmin"
        );
        // ถ้าเป็น admin ให้ isPro = true เลย
        const effectiveIsPro = user?.isAdmin || user?.isPro;
        const obj = profile.toObject();
        return res.json({ ...obj, isPro: !!effectiveIsPro });
    } catch (e) {
        console.error("Fetch profile error", e);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

module.exports = router;
