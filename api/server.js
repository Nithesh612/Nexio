const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });
require("./db");

const hubRoutes = require("./routes/hub");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
});

// Allowed Origins
const allowedOrigins = [
    "https://nexio-hub.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5173"
];

// CORS Configuration - Explicitly allows production domain, preview domains, and local dev
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1")
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body Parsers with safe payload limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check & default route
app.get("/", (req, res) => {
    res.json({
        message: "Nexio API server is running smoothly",
        status: "OK",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

app.get("/health", (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.status(isDbConnected ? 200 : 503).json({
        status: isDbConnected ? "healthy" : "degraded",
        database: isDbConnected ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use("/hub", hubRoutes);
app.use("/books", hubRoutes); // backward compatibility alias
app.use("/users", userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack || err.message);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
        status: "error"
    });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Nexio API server is running on port ${PORT}`);
});

// Graceful Shutdown Handler
const handleGracefulShutdown = (signal) => {
    console.log(`\nReceived ${signal}. Gracefully shutting down...`);
    server.close(async () => {
        console.log("HTTP server closed.");
        try {
            await mongoose.connection.close(false);
            console.log("MongoDB connection cleanly closed.");
        } catch (err) {
            console.error("Error closing MongoDB connection:", err.message);
        }
        process.exit(0);
    });
};

process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));
process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));