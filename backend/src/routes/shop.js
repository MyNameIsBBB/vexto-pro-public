const express = require("express");
const CreatorSubmission = require("../models/CreatorSubmission");

const router = express.Router();

// Public: list approved creator items for shop display
router.get("/creator-items", async (req, res, next) => {
    try {
        const items = await CreatorSubmission.find({ status: "approved" })
            .sort({ createdAt: -1 })
            .lean();
        const mapped = items.map((it) => ({
            id: `creator-${it._id}`,
            title: it.title,
            desc: it.description || "",
            price: it.price || 49,
            tag: "สนับสนุนนักพัฒนา",
            image: it.coverImage || it.assetUrls?.[0] || "",
            category: it.category,
        }));
        res.json({ ok: true, items: mapped });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
