const mongoose = require("mongoose");

const CreatorSubmissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        category: {
            type: String,
            enum: ["frame", "component", "background", "effect"],
            required: true,
        },
        price: { type: Number, default: 49, min: 0 },
        assetUrls: { type: [String], default: [] },
        config: { type: mongoose.Schema.Types.Mixed, default: {} },
        coverImage: { type: String, default: "" },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CreatorSubmission", CreatorSubmissionSchema);
