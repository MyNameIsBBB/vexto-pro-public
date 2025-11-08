const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Profile = require("../models/Profile");

// Public stats endpoint
router.get("/", async (req, res) => {
    try {
        const [userCount, profileCount] = await Promise.all([
            User.countDocuments(),
            Profile.countDocuments(),
        ]);

        res.json({
            users: userCount,
            profiles: profileCount,
            responseTime: "< 1 วินาที",
        });
    } catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

module.exports = router;
