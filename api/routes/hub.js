const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Hub / Link Schema (No extra models folder needed)
const linkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    url: {
        type: String,
        required: [true, "URL is required"],
        trim: true
    },
    category: {
        type: String,
        default: "General",
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Map _id to id
linkSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Link = mongoose.models.Link || mongoose.model("Link", linkSchema);

// GET all links / bookmarks
router.get("/", async (req, res) => {
    try {
        const links = await Link.find().sort({ createdAt: -1 });
        res.json(links);
    } catch (error) {
        console.error("GET /hub error:", error);
        res.status(500).json({ error: "Failed to fetch links" });
    }
});

// GET single link by ID
router.get("/:id", async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        if (!link) {
            return res.status(404).json({ error: "Link not found" });
        }
        res.json(link);
    } catch (error) {
        console.error("GET /hub/:id error:", error);
        res.status(500).json({ error: "Failed to fetch link" });
    }
});

// POST create new link
router.post("/", async (req, res) => {
    try {
        const { title, url, category, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }
        if (!url || !url.trim()) {
            return res.status(400).json({ error: "URL is required" });
        }

        const newLink = new Link({
            title: title.trim(),
            url: url.trim(),
            category: category ? category.trim() : "General",
            description: description ? description.trim() : ""
        });

        const savedLink = await newLink.save();
        res.status(201).json(savedLink);
    } catch (error) {
        console.error("POST /hub error:", error);
        res.status(500).json({ error: "Failed to create link" });
    }
});

// PUT update link
router.put("/:id", async (req, res) => {
    try {
        const { title, url, category, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }
        if (!url || !url.trim()) {
            return res.status(400).json({ error: "URL is required" });
        }

        const updatedLink = await Link.findByIdAndUpdate(
            req.params.id,
            {
                title: title.trim(),
                url: url.trim(),
                category: category ? category.trim() : "General",
                description: description ? description.trim() : ""
            },
            { new: true, runValidators: true }
        );

        if (!updatedLink) {
            return res.status(404).json({ error: "Link not found to update" });
        }

        res.json(updatedLink);
    } catch (error) {
        console.error("PUT /hub/:id error:", error);
        res.status(500).json({ error: "Failed to update link" });
    }
});

// DELETE link
router.delete("/:id", async (req, res) => {
    try {
        const deletedLink = await Link.findByIdAndDelete(req.params.id);
        if (!deletedLink) {
            return res.status(404).json({ error: "Link not found to delete" });
        }
        res.json({ message: "Link deleted successfully" });
    } catch (error) {
        console.error("DELETE /hub/:id error:", error);
        res.status(500).json({ error: "Failed to delete link" });
    }
});

module.exports = router;
