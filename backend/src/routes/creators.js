const express = require("express");
const CreatorSubmission = require("../models/CreatorSubmission");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// Submit a new creator item (auth required)
router.post("/submit", auth, async (req, res, next) => {
    try {
        const {
            title,
            description,
            category,
            price,
            assetUrls,
            config,
            coverImage,
        } = req.body || {};
        if (!title || !category) {
            return res
                .status(400)
                .json({ error: "title and category are required" });
        }
        const doc = await CreatorSubmission.create({
            userId: req.userId,
            title,
            description: description || "",
            category,
            price: typeof price === "number" ? price : 49,
            assetUrls: Array.isArray(assetUrls) ? assetUrls : [],
            config: config || {},
            coverImage:
                coverImage || (Array.isArray(assetUrls) && assetUrls[0]) || "",
        });
        res.json({ ok: true, id: doc._id, status: doc.status });
    } catch (e) {
        next(e);
    }
});

// List my submissions
router.get("/my-submissions", auth, async (req, res, next) => {
    try {
        const items = await CreatorSubmission.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .lean();
        res.json({ ok: true, items });
    } catch (e) {
        next(e);
    }
});

// Admin: list submissions by status
router.get("/submissions", auth, admin, async (req, res, next) => {
    try {
        const { status } = req.query;
        const q = status ? { status } : {};
        const items = await CreatorSubmission.find(q)
            .sort({ createdAt: -1 })
            .lean();
        res.json({ ok: true, items });
    } catch (e) {
        next(e);
    }
});

// Admin: approve a submission
router.put("/submissions/:id/approve", auth, admin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const doc = await CreatorSubmission.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true }
        );
        if (!doc) return res.status(404).json({ error: "Not found" });
        res.json({ ok: true, id: doc._id, status: doc.status });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
