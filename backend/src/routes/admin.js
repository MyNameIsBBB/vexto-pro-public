const express = require("express");
const User = require("../models/User");
const Profile = require("../models/Profile");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// Search users (admin only)
router.get("/users/search", auth, admin, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.status(400).json({ error: "Search query required" });
        }

        const searchQuery = q.trim().toLowerCase();
        const users = await User.find({
            $or: [
                { email: { $regex: searchQuery, $options: "i" } },
                { username: { $regex: searchQuery, $options: "i" } },
            ],
        })
            .select("email username isPro isAdmin proTier proExpiry createdAt")
            .limit(20);

        res.json(users);
    } catch (e) {
        console.error("Search users error", e);
        res.status(500).json({ error: "Failed to search users" });
    }
});

// Get user details (admin only)
router.get("/users/:userId", auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select(
            "email username isPro isAdmin proTier proExpiry purchasedItems createdAt updatedAt"
        );
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const profile = await Profile.findOne({ userId: user._id });

        res.json({
            user,
            profile,
        });
    } catch (e) {
        console.error("Get user details error", e);
        res.status(500).json({ error: "Failed to get user details" });
    }
});

// Update user (admin only)
router.put("/users/:userId", auth, admin, async (req, res) => {
    try {
        const { isPro, isAdmin, proTier, proExpiry, purchasedItems } = req.body;

        const updateData = {};
        if (typeof isPro === "boolean") updateData.isPro = isPro;
        if (typeof isAdmin === "boolean") updateData.isAdmin = isAdmin;
        if (proTier) updateData.proTier = proTier;
        if (proExpiry !== undefined) updateData.proExpiry = proExpiry;
        if (Array.isArray(purchasedItems))
            updateData.purchasedItems = purchasedItems;

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updateData },
            { new: true }
        ).select(
            "email username isPro isAdmin proTier proExpiry purchasedItems"
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (e) {
        console.error("Update user error", e);
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete user (admin only)
router.delete("/users/:userId", auth, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Delete associated profile
        await Profile.deleteMany({ userId: user._id });

        res.json({ message: "User deleted successfully" });
    } catch (e) {
        console.error("Delete user error", e);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

module.exports = router;
