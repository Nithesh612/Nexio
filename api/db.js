const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

const connectDB = async () => {
    try {
        // Fallback to localhost if MONGODB_URI is not set
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wallet";
        await mongoose.connect(uri, { dbName: "wallet" });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

// Connect immediately when required
connectDB();

module.exports = mongoose;
