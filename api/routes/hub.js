const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureProtocol, saveLinkToGoogleDoc } = require("./googleDocs");

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
    description: {
        type: String,
        default: "",
        trim: true
    },
    collection: {
        type: String,
        default: "All Links",
        trim: true
    },
    favorite: {
        type: Boolean,
        default: false
    },
    readLater: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    suppressReservedKeysWarning: true
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

function titleFromUrl(url) {
    try {
        const host = new URL(ensureProtocol(url)).hostname.replace(/^www\./i, "");
        const name = host.split(".")[0];
        return name ? name.charAt(0).toUpperCase() + name.slice(1) : host;
    } catch {
        return "Imported Link";
    }
}

function normalizeImportLink(item) {
    const rawUrl = String(item.url || item.link || item.URL || "").trim();
    if (!rawUrl) return null;

    const normalizedUrl = ensureProtocol(rawUrl);
    const title = String(item.title || item.name || item.Title || titleFromUrl(normalizedUrl)).trim();
    const category = String(item.category || item.type || item.Category || "Imported").trim();
    const description = String(item.description || item.desc || item.Description || "").trim();
    const collection = String(item.collection || item.Collection || "All Links").trim();

    return {
        title: title || titleFromUrl(normalizedUrl),
        url: normalizedUrl,
        category: category || "Imported",
        description,
        collection: collection || "All Links",
        favorite: item.favorite === true || String(item.favorite).toLowerCase() === "true",
        readLater: item.readLater === true || String(item.readLater).toLowerCase() === "true",
    };
}

function csvEscape(value) {
    const text = String(value ?? "");
    if (/[",\n\r]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

function linksToCsv(links) {
    const headers = ["title", "url", "category", "description", "createdAt"];
    const rows = links.map((link) => [
        link.title,
        link.url,
        link.category,
        link.description || "",
        link.createdAt ? link.createdAt.toISOString() : "",
    ]);

    return [
        headers.join(","),
        ...rows.map((row) => row.map(csvEscape).join(",")),
    ].join("\n");
}

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

// GET export links as JSON or CSV
router.get("/export", async (req, res) => {
    try {
        const format = String(req.query.format || "json").toLowerCase();
        const links = await Link.find().sort({ createdAt: -1 });

        if (format === "csv") {
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", "attachment; filename=\"nexio-links.csv\"");
            return res.send(linksToCsv(links));
        }

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=\"nexio-links.json\"");
        return res.json({
            exportedAt: new Date().toISOString(),
            count: links.length,
            links,
        });
    } catch (error) {
        console.error("GET /hub/export error:", error);
        res.status(500).json({ error: "Failed to export links" });
    }
});

// POST import links from parsed JSON/CSV data
router.post("/import", async (req, res) => {
    try {
        const incomingLinks = Array.isArray(req.body)
            ? req.body
            : Array.isArray(req.body.links)
                ? req.body.links
                : [];

        if (!incomingLinks.length) {
            return res.status(400).json({ error: "No links found to import" });
        }

        const normalizedLinks = incomingLinks
            .map(normalizeImportLink)
            .filter(Boolean);

        if (!normalizedLinks.length) {
            return res.status(400).json({ error: "Import file must include at least one URL" });
        }

        const urls = [...new Set(normalizedLinks.map((link) => link.url))];
        const existingLinks = await Link.find({ url: { $in: urls } }).select("url");
        const existingUrls = new Set(existingLinks.map((link) => link.url));
        const uniqueLinks = normalizedLinks.filter((link, index, list) =>
            !existingUrls.has(link.url)
            && list.findIndex((candidate) => candidate.url === link.url) === index
        );

        const insertedLinks = uniqueLinks.length ? await Link.insertMany(uniqueLinks) : [];

        res.status(201).json({
            imported: insertedLinks.length,
            skipped: normalizedLinks.length - insertedLinks.length,
            links: insertedLinks,
        });
    } catch (error) {
        console.error("POST /hub/import error:", error);
        res.status(500).json({ error: "Failed to import links" });
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
        const { title, url, category, description, collection, favorite, readLater } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }
        if (!url || !url.trim()) {
            return res.status(400).json({ error: "URL is required" });
        }

        const normalizedUrl = ensureProtocol(url.trim());

        // Check if link already exists in database
        const existingLink = await Link.findOne({
            $or: [
                { url: normalizedUrl },
                { url: url.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '') },
                { url: new RegExp(`^https?:\\/\\/(www\\.)?${url.trim().replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')}\\/?$`, 'i') }
            ]
        });

        if (existingLink) {
            return res.status(409).json({
                error: "This link is already saved in your hub! Duplicate links cannot be added.",
                isDuplicate: true,
                existingLink
            });
        }

        const newLink = new Link({
            title: title.trim(),
            url: normalizedUrl,
            category: category ? category.trim() : "General",
            description: description ? description.trim() : "",
            collection: collection ? collection.trim() : "All Links",
            favorite: Boolean(favorite),
            readLater: Boolean(readLater)
        });

        const savedLink = await newLink.save();
        let docSaved = false;
        let docError = null;

        try {
            await saveLinkToGoogleDoc({
                title: savedLink.title,
                url: savedLink.url,
                category: savedLink.category,
                description: savedLink.description,
            });
            docSaved = true;
        } catch (error) {
            docError = error.message;
            console.error("Google Docs save failed:", error);
        }

        res.status(docSaved ? 201 : 207).json({
            ...savedLink.toJSON(),
            docSaved,
            docError,
        });
    } catch (error) {
        console.error("POST /hub error:", error);
        res.status(500).json({ error: "Failed to create link" });
    }
});

// PUT update link
router.put("/:id", async (req, res) => {
    try {
        const { title, url, category, description, collection, favorite, readLater } = req.body;

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
                description: description ? description.trim() : "",
                collection: collection ? collection.trim() : "All Links",
                favorite: Boolean(favorite),
                readLater: Boolean(readLater)
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
