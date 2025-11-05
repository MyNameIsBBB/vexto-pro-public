// Backend API Serverless Function
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Import routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const feedbackRoutes = require("./routes/feedback");
const creatorsRoutes = require("./routes/creators");
const paymentRoutes = require("./routes/payment");

// Security middleware
app.use(helmet());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || [
            "http://localhost:3000",
            "http://localhost:3001",
        ],
        credentials: true,
    })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Connect to MongoDB
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

if (!mongoose.connection.readyState) {
    mongoose
        .connect(MONGODB_URI)
        .then(() => console.log("✅ MongoDB Connected"))
        .catch((err) => console.error("❌ MongoDB Connection Error:", err));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/creators", creatorsRoutes);
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
