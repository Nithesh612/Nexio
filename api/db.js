const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

let isConnecting = false;

const connectDB = async () => {
    if (isConnecting || mongoose.connection.readyState === 1) {
        return;
    }

    isConnecting = true;
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wallet";
        await mongoose.connect(uri, {
            dbName: "wallet",
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("🟢 MongoDB Atlas connected successfully");
    } catch (error) {
        console.error("🔴 MongoDB connection error:", error.message);
        // Retry connection after 5 seconds instead of crashing process
        setTimeout(connectDB, 5000);
    } finally {
        isConnecting = false;
    }
};

// Connection lifecycle event handlers
mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Attempting reconnection...");
    setTimeout(connectDB, 3000);
});

mongoose.connection.on("error", (err) => {
    console.error("⚠️ MongoDB connection error event:", err.message);
});

// Connect immediately on startup
connectDB();

module.exports = mongoose;
