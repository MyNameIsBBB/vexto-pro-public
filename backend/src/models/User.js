const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: { type: String, required: true },
        // Admin
        isAdmin: { type: Boolean, default: false },
        // Entitlements
        isPro: { type: Boolean, default: false },
        proTier: {
            type: String,
            enum: ["free", "monthly", "yearly"],
            default: "free",
        },
        proExpiry: { type: Date, default: null },
        purchasedItems: { type: [String], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
