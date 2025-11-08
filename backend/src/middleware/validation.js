// Input validation and sanitization helpers
const xss = require("xss");

// Sanitize string input
function sanitizeString(str, maxLength = 1000) {
    if (typeof str !== "string") return "";
    return xss(str.trim().slice(0, maxLength));
}

// Validate email format
function isValidEmail(email) {
    if (typeof email !== "string") return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

// Validate username format
function isValidUsername(username) {
    if (typeof username !== "string") return false;
    const re = /^[a-z0-9_.-]+$/;
    return (
        re.test(username.toLowerCase()) &&
        username.length >= 3 &&
        username.length <= 30
    );
}

// Validate URL format
function isValidUrl(url) {
    if (typeof url !== "string") return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

// Middleware to validate profile update payload
function validateProfileUpdate(req, res, next) {
    const { displayName, bio, blocks } = req.body;

    // Validate displayName
    if (displayName && typeof displayName === "string") {
        if (displayName.length > 100) {
            return res
                .status(400)
                .json({ error: "Display name too long (max 100 chars)" });
        }
        req.body.displayName = sanitizeString(displayName, 100);
    }

    // Validate bio
    if (bio && typeof bio === "string") {
        if (bio.length > 500) {
            return res
                .status(400)
                .json({ error: "Bio too long (max 500 chars)" });
        }
        req.body.bio = sanitizeString(bio, 500);
    }

    // Validate blocks array
    if (blocks && Array.isArray(blocks)) {
        if (blocks.length > 50) {
            return res.status(400).json({ error: "Too many blocks (max 50)" });
        }
        // Preserve extra top-level keys by merging them into props (e.g., header)
        req.body.blocks = blocks.map((block) => {
            if (!block.type || typeof block.type !== "string") {
                throw new Error("Invalid block type");
            }
            const cleanType = block.type.toLowerCase().trim();
            const baseProps = block && typeof block.props === "object" && block.props ? { ...block.props } : {};
            Object.keys(block || {}).forEach((k) => {
                if (!["id", "type", "props"].includes(k)) {
                    if (baseProps[k] === undefined) baseProps[k] = block[k];
                }
            });
            return {
                id: block.id || require("uuid").v4(),
                type: cleanType,
                props: baseProps,
            };
        });
    }

    next();
}

module.exports = {
    sanitizeString,
    isValidEmail,
    isValidUsername,
    isValidUrl,
    validateProfileUpdate,
};
