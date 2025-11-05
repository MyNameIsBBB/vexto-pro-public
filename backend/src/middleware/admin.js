const User = require("../models/User");

async function admin(req, res, next) {
    // Allow by explicit userId list
    const allowIds = (process.env.ADMIN_IDS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (allowIds.includes(String(req.userId))) return next();

    // Allow by email list (optional)
    const allowEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    if (allowEmails.length) {
        let email = req.userEmail;
        if (!email && req.userId) {
            const user = await User.findById(req.userId).select("email");
            email = user?.email || null;
            if (email) req.userEmail = email;
        }
        if (email && allowEmails.includes(String(email).toLowerCase())) {
            return next();
        }
    }

    return res.status(403).json({ error: "Forbidden" });
}

module.exports = admin;
