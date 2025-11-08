const rateLimit = require("express-rate-limit");

// General API rate limiter (100 requests per 15 minutes)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for auth endpoints (10 login attempts per 15 minutes)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        error: "Too many authentication attempts, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Only limit POST requests (login/register), not GET
    skip: (req) => req.method === 'GET',
});

// Profile limiter - lenient for reads, strict for writes
const profileLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
        // Allow more GET requests (reads) vs PUT/POST (writes)
        return req.method === 'GET' ? 200 : 30;
    },
    message: { error: "Too many profile requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, profileLimiter };
