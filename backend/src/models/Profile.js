const mongoose = require("mongoose");

const ThemeSchema = new mongoose.Schema(
    {
        mode: { type: String, enum: ["light", "dark"], default: "dark" },
        primary: { type: String, default: "#7c3aed" },
        background: { type: String, default: "#0b1020" },
        // Outer/inner background model
        outerBackground: { type: String, default: "#0b1020" },
        accent: { type: String, default: "#22d3ee" },
        borderRadius: { type: String, default: "12px" },
        // Typography & text colors
        textColor: { type: String, default: "#f3f4f6" },
        fontFamily: {
            type: String,
            enum: ["prompt", "kanit", "sarabun"],
            default: "prompt",
        },
        textOverrides: {
            type: new mongoose.Schema(
                {
                    name: { type: String, default: "" },
                    header: { type: String, default: "" },
                    body: { type: String, default: "" },
                    muted: { type: String, default: "" },
                    role: { type: String, default: "" },
                    link: { type: String, default: "" },
                    buttonLabel: { type: String, default: "" },
                },
                { _id: false }
            ),
            default: () => ({}),
        },
        backgroundImage: { type: String, default: "" },
        outerBackgroundImage: { type: String, default: "" },
        backgroundScope: {
            type: String,
            enum: ["card", "full"],
            default: "card",
        },
        // Element-level colors for fine-tuning
        elementColors: {
            type: new mongoose.Schema(
                {
                    blockBg: { type: String, default: "" },
                    blockBorder: { type: String, default: "" },
                    divider: { type: String, default: "" },
                    quoteAccent: { type: String, default: "" },
                    buttonBg: { type: String, default: "" },
                },
                { _id: false }
            ),
            default: () => ({}),
        },
    },
    { _id: false }
);

const BlockSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        type: { type: String, required: true }, // text | link | image | socials | video
        props: { type: Object, default: {} },
    },
    { _id: false }
);

const ProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
            unique: true, // enforce one profile per user
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        displayName: { type: String, required: true },
        avatarUrl: { type: String, default: "" },
        bio: { type: String, default: "" },
        theme: { type: ThemeSchema, default: () => ({}) },
        blocks: { type: [BlockSchema], default: [] },
        isPublic: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
