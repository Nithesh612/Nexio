const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// POST login authentication
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const envUser = process.env.USER;
        const envPass = process.env.PASSWORD;

        // Direct match with .env admin credentials only
        if (envUser && envPass && email.trim().toLowerCase() === envUser.trim().toLowerCase() && password === envPass) {
            return res.json({
                success: true,
                message: "Login successful",
                user: {
                    email: envUser,
                    name: envUser.split('@')[0],
                    role: "admin",
                    avatar: envUser.charAt(0).toUpperCase(),
                    loginTime: new Date().toISOString()
                }
            });
        }

        return res.status(401).json({ error: "Invalid email or password." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
