require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const feedbackRoutes = require("./routes/feedback");
const paymentRoutes = require("./routes/payment");
const creatorsRoutes = require("./routes/creators");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const {
    apiLimiter,
    authLimiter,
    profileLimiter,
} = require("./middleware/rateLimiter");

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("tiny"));

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
    "http://localhost:3000",
];
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (
                allowedOrigins.includes("*") ||
                allowedOrigins.includes(origin)
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Apply general rate limiter to all API routes
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "vectr-backend",
        time: new Date().toISOString(),
    });
});

// Routes with specific rate limiters
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/profiles", profileLimiter, profileRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/creators", creatorsRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
    try {
        if (!MONGODB_URI) {
            console.warn(
                "MONGODB_URI not set. The server will start, but DB actions will fail."
            );
        } else {
            await mongoose.connect(MONGODB_URI);
            console.log("Connected to MongoDB");
        }
        app.listen(PORT, () => {
            console.log(`API listening on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error("Failed to start server:", e);
        process.exit(1);
    }
}

start();
