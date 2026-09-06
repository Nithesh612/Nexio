const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

function ensureProtocol(url) {
    if (!url) return '';
    const trimmed = String(url).trim();
    if (/^(javascript|data|vbscript):/i.test(trimmed)) {
        return '';
    }
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

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
    badge: {
        type: String,
        default: "",
        trim: true
    },
    logoUrl: {
        type: String,
        default: "",
        trim: true
    },
    bannerUrl: {
        type: String,
        default: "",
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
    suppressReservedKeysWarning: true,
    strict: false
});

// Indexes for fast querying and indexing at scale
linkSchema.index({ createdAt: -1 });
linkSchema.index({ url: 1 });
linkSchema.index({ category: 1 });
linkSchema.index({ collection: 1 });
linkSchema.index({ favorite: 1 });

// Map _id to id
linkSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Link = mongoose.models.Link || mongoose.model("Link", linkSchema);

// Dedicated QuickAsset Schema & Model -> creates 'quickassets' collection in MongoDB (wallet database)
const quickAssetSchema = new mongoose.Schema({
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
        default: "Featured Quick Asset",
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    collection: {
        type: String,
        default: "Quick Assets",
        trim: true
    },
    badge: {
        type: String,
        default: "Free",
        trim: true
    },
    logoUrl: {
        type: String,
        default: "",
        trim: true
    },
    bannerUrl: {
        type: String,
        default: "",
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
    suppressReservedKeysWarning: true,
    strict: false
});

quickAssetSchema.index({ createdAt: -1 });
quickAssetSchema.index({ url: 1 });
quickAssetSchema.index({ category: 1 });

quickAssetSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const QuickAsset = mongoose.models.QuickAsset || mongoose.model("QuickAsset", quickAssetSchema, "Quick-assets");

const DEFAULT_QUICK_ASSETS = [
    {
        title: 'Fabric',
        description: 'Smart organizer for notes & links',
        badge: 'Free',
        url: 'https://fabric.so/?via=toools',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://fabric.so',
        logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/678cd7ab0827ce6d17abe72e_fabric-bookmarking-notetaking-tool.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'Chronicle',
        description: 'A modern format of storytelling',
        badge: 'Free',
        url: 'https://chr.so/toools',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://chr.so',
        logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6419a8603e72984af76cd290_chronicle.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'Holo',
        description: 'AI marketing content generation',
        badge: 'Paid',
        url: 'https://hololtuab.sjv.io/Bng6JJ',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://holo.to',
        logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/68ecb78dab0a9e25ee5ed065_holo-marketing-content-ai-generation.webp',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'LiveSurface',
        description: 'Hyper real 3D packaging mockups',
        badge: 'App',
        url: 'https://www.livesurface.com/',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://www.livesurface.com',
        logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6512d8dc282ac6b8193ed1a2_deal-icon-live-surface.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'Framify',
        description: '1k+ Framer UI components',
        badge: 'Framer',
        url: 'https://framify.design/?aff=kzPjR',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://framify.design',
        logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/691c70f79b18baff442bf92e_deal-icon-framify.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'Squarespace',
        description: 'Website builder & hosting platform',
        badge: 'Trial',
        url: 'https://squarespace.syuh.net/Zd7ELk',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://squarespace.com',
        logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/63ebfe215b31067c0f2f3b0e_deal-icon-squarespace.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'Figma',
        description: 'Industry standard interface design',
        badge: 'Essential',
        url: 'https://www.figma.com/?via=toools',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://figma.com',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'Notion',
        description: 'Connected workspace for wiki & docs',
        badge: 'Daily',
        url: 'https://www.notion.so',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://notion.so',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'Canva',
        description: 'Graphic design & social layouts',
        badge: 'Free',
        url: 'https://www.canva.com',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://canva.com',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'Blender',
        description: 'Open source 3D creation suite',
        badge: 'Open Source',
        url: 'https://www.blender.org',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://blender.org',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'Recraft AI',
        description: 'Generative vector art & icons',
        badge: 'Free',
        url: 'https://www.recraft.ai/?via=toools',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://recraft.ai',
        logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69121485b4b3f85b96e3cc19_brain-ai.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
    {
        title: 'Jitter',
        description: 'UI animation tool in the browser',
        badge: 'Plugin',
        url: 'https://jitter.video/?via=toools',
        bannerUrl: 'https://image.thum.io/get/width/700/crop/480/noanimate/https://jitter.video',
        logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/691215396e6cc06bef3a16f9_lightning.svg',
        category: 'Featured Quick Asset',
        collection: 'Quick Assets',
    },
];

function titleFromUrl(url) {
    try {
        const host = new URL(ensureProtocol(url)).hostname.replace(/^www\./i, "");
        const name = host.split(".")[0];
        return name ? name.charAt(0).toUpperCase() + name.slice(1) : host;
    } catch {
        return "Imported Link";
    }
}

function analyzeUrlMetadata(rawUrl) {
    if (!rawUrl) return {};
    let hostname = '';
    let pathname = '';
    try {
        const parsed = new URL(ensureProtocol(rawUrl));
        hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
        pathname = parsed.pathname.toLowerCase();
    } catch {
        return {};
    }

    const fullSearch = `${hostname} ${pathname}`.toLowerCase();

    if (/coolors\.co|colorhunt\.co|realtimecolors\.com|colorsandfonts\.com|khroma\.co|colormind\.io|paletton\.com/i.test(fullSearch)) {
        return {
            category: 'UI/UX',
            description: 'Super fast color palettes generator, contrast tools, and design color resources.'
        };
    }

    if (/figma\.com/i.test(fullSearch)) {
        return {
            category: 'UI/UX',
            description: 'Collaborative interface design, prototyping, and design systems platform.'
        };
    }

    if (/uiverse\.io|21st\.dev|shadcn|tailwindcss\.com|heroicons\.com|lucide\.dev/i.test(fullSearch)) {
        return {
            category: 'UI/UX',
            description: 'Open-source UI component library, animations, and design system elements.'
        };
    }

    if (/dribbble\.com|behance\.net|awwwards\.com|godly\.website|mobbin\.com|lapa\.ninja/i.test(fullSearch)) {
        return {
            category: 'Inspiration',
            description: 'Creative design inspiration, product UI showcases, and portfolio references.'
        };
    }

    if (/openai\.com|chatgpt\.com|claude\.ai|anthropic\.com|perplexity\.ai|v0\.dev|cursor\.com|deepseek\.com/i.test(fullSearch)) {
        return {
            category: 'AI',
            description: 'Advanced generative AI, reasoning models, and autonomous agent platform.'
        };
    }

    if (/midjourney\.com|runwayml\.com|elevenlabs\.io|pika\.art|suno\.ai|klingai\.com|luma\.ai/i.test(fullSearch)) {
        return {
            category: 'AI Image & Video',
            description: 'Generative AI image creation, video synthesis, and visual creation studio.'
        };
    }

    if (/unsplash\.com|pexels\.com|freepik\.com|pixabay\.com/i.test(fullSearch)) {
        return {
            category: 'Stock',
            description: 'High-resolution royalty-free stock photos, illustrations, and media assets.'
        };
    }

    if (/github\.com|gitlab\.com|stackoverflow\.com|npmjs\.com|developer\.mozilla\.org/i.test(fullSearch)) {
        return {
            category: 'Tools',
            description: 'Developer code repositories, open-source tools, and programming documentation.'
        };
    }

    if (/vercel\.com|netlify\.com|render\.com|railway\.app|supabase\.com|firebase\.google\.com/i.test(fullSearch)) {
        return {
            category: 'Host',
            description: 'Cloud deployment, backend infrastructure, databases, and serverless hosting.'
        };
    }

    if (/(color|palette|gradient|hex|theme|tint|shade|pigment|swatch)/i.test(fullSearch)) {
        return {
            category: 'UI/UX',
            description: 'Color palette generator, hex codes, and design color resources.'
        };
    }

    return {};
}

function normalizeImportLink(item) {
    const rawUrl = String(item.url || item.link || item.URL || "").trim();
    if (!rawUrl) return null;

    const normalizedUrl = ensureProtocol(rawUrl);
    const smartMeta = analyzeUrlMetadata(normalizedUrl);
    const title = String(item.title || item.name || item.Title || titleFromUrl(normalizedUrl)).trim();
    const rawCategory = String(item.category || item.type || item.Category || "").trim();
    const category = (rawCategory && rawCategory !== "Imported" && rawCategory !== "General")
        ? rawCategory
        : (smartMeta.category || "Imported");
    const rawDescription = String(item.description || item.desc || item.Description || "").trim();
    const description = rawDescription || smartMeta.description || "";
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

// GET all links / bookmarks + quick assets (Supports server-side filters & optional pagination)
router.get("/", async (req, res) => {
    try {
        const { search, category, collection, page, limit } = req.query;

        let linkQuery = {};
        let quickQuery = {};

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            const orClause = [
                { title: searchRegex },
                { url: searchRegex },
                { description: searchRegex },
                { category: searchRegex }
            ];
            linkQuery.$or = orClause;
            quickQuery.$or = orClause;
        }

        if (category && category.trim() && category !== 'All' && category !== 'all') {
            const catRegex = new RegExp(category.trim(), 'i');
            linkQuery.category = catRegex;
            quickQuery.category = catRegex;
        }

        if (collection && collection.trim()) {
            linkQuery.collection = new RegExp(collection.trim(), 'i');
            quickQuery.collection = new RegExp(collection.trim(), 'i');
        }

        const [links, quickAssets] = await Promise.all([
            Link.find(linkQuery).sort({ createdAt: -1 }),
            QuickAsset.find(quickQuery).sort({ createdAt: -1 })
        ]);

        const formattedQuick = quickAssets.map(item => ({
            ...item.toJSON(),
            collection: item.collection || "Quick Assets",
            category: item.category || "Featured Quick Asset",
            kind: "quick-asset"
        }));
        const formattedLinks = links.map(item => item.toJSON());
        const allItems = [...formattedQuick, ...formattedLinks];

        // Optional server-side pagination
        if (page && limit) {
            const pageNum = Math.max(1, parseInt(page, 10) || 1);
            const limitNum = Math.max(1, parseInt(limit, 10) || 20);
            const startIndex = (pageNum - 1) * limitNum;
            const paginatedItems = allItems.slice(startIndex, startIndex + limitNum);

            return res.json({
                total: allItems.length,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(allItems.length / limitNum),
                links: paginatedItems
            });
        }

        res.json(allItems);
    } catch (error) {
        console.error("GET /hub error:", error);
        res.status(500).json({ error: "Failed to fetch links" });
    }
});

// GET dedicated quick assets from 'Quick-assets' collection
router.get("/quickassets", async (req, res) => {
    try {
        const quickAssets = await QuickAsset.find().sort({ createdAt: -1 });
        res.json(quickAssets);
    } catch (error) {
        console.error("GET /hub/quickassets error:", error);
        res.status(500).json({ error: "Failed to fetch quick assets" });
    }
});

// POST seed default quick assets into 'Quick-assets' collection in MongoDB
router.post("/seed", async (req, res) => {
    try {
        const quickCount = await QuickAsset.countDocuments();
        if (quickCount > 0) {
            return res.status(200).json({ seeded: false, message: "Quick assets collection already exists in database." });
        }
        const inserted = await QuickAsset.insertMany(DEFAULT_QUICK_ASSETS);
        res.status(201).json({ seeded: true, count: inserted.length });
    } catch (error) {
        console.error("POST /hub/seed error:", error);
        res.status(500).json({ error: "Failed to seed quick assets" });
    }
});

// GET export links as JSON or CSV
router.get("/export", async (req, res) => {
    try {
        const format = String(req.query.format || "json").toLowerCase();
        const [links, quickAssets] = await Promise.all([
            Link.find().sort({ createdAt: -1 }),
            QuickAsset.find().sort({ createdAt: -1 })
        ]);
        const all = [...quickAssets, ...links];

        if (format === "csv") {
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", "attachment; filename=\"nexio-links.csv\"");
            return res.send(linksToCsv(all));
        }

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=\"nexio-links.json\"");
        return res.json({
            exportedAt: new Date().toISOString(),
            count: all.length,
            links: all,
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
        const [existingLinks, existingQuick] = await Promise.all([
            Link.find({ url: { $in: urls } }).select("url"),
            QuickAsset.find({ url: { $in: urls } }).select("url")
        ]);
        const existingUrls = new Set([...existingLinks.map((l) => l.url), ...existingQuick.map((l) => l.url)]);
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

// GET single link or quick asset by ID
router.get("/:id", async (req, res) => {
    try {
        let item = await QuickAsset.findById(req.params.id);
        if (!item) {
            item = await Link.findById(req.params.id);
        }
        if (!item) {
            return res.status(404).json({ error: "Link/Asset not found" });
        }
        res.json(item.toJSON());
    } catch (error) {
        console.error("GET /hub/:id error:", error);
        res.status(500).json({ error: "Failed to fetch link" });
    }
});

// POST create new link or quick asset
router.post("/", async (req, res) => {
    try {
        const { title, url, category, description, collection, favorite, readLater, badge, logoUrl, bannerUrl } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }
        if (!url || !url.trim()) {
            return res.status(400).json({ error: "URL is required" });
        }

        const normalizedUrl = ensureProtocol(url.trim());
        const cleanRaw = url.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');
        const escapedRaw = cleanRaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const smartMeta = analyzeUrlMetadata(normalizedUrl);
        const resolvedCategory = (category && category.trim() !== "General" && category.trim() !== "Imported")
            ? category.trim()
            : (smartMeta.category || "General");
        const resolvedDescription = (description && description.trim())
            ? description.trim()
            : (smartMeta.description || "");

        const isQuick = collection === "Quick Assets" ||
            resolvedCategory === "Featured Quick Asset" ||
            resolvedCategory === "Quick Assets" ||
            resolvedCategory.toLowerCase().includes("quick");

        const TargetModel = isQuick ? QuickAsset : Link;
        const targetCollection = isQuick ? "Quick Assets" : (collection ? collection.trim() : "All Links");

        // Check if link already exists in target collection
        const existingDoc = await TargetModel.findOne({
            $or: [
                { url: normalizedUrl },
                { url: cleanRaw },
                { url: new RegExp(`^https?:\\/\\/(www\\.)?${escapedRaw}\\/?$`, 'i') }
            ]
        });

        if (existingDoc) {
            existingDoc.title = title.trim() || existingDoc.title;
            existingDoc.category = resolvedCategory;
            if (resolvedDescription) existingDoc.description = resolvedDescription;
            existingDoc.collection = targetCollection;
            if (badge !== undefined) existingDoc.badge = badge;
            if (logoUrl !== undefined) existingDoc.logoUrl = logoUrl;
            if (bannerUrl !== undefined) existingDoc.bannerUrl = bannerUrl;
            if (favorite !== undefined) existingDoc.favorite = Boolean(favorite);
            if (readLater !== undefined) existingDoc.readLater = Boolean(readLater);
            const updated = await existingDoc.save();
            return res.status(200).json(updated.toJSON());
        }

        const newDoc = new TargetModel({
            title: title.trim(),
            url: normalizedUrl,
            category: resolvedCategory,
            description: resolvedDescription,
            collection: targetCollection,
            badge: badge ? String(badge).trim() : (isQuick ? "Free" : ""),
            logoUrl: logoUrl ? String(logoUrl).trim() : "",
            bannerUrl: bannerUrl ? String(bannerUrl).trim() : "",
            favorite: Boolean(favorite),
            readLater: Boolean(readLater)
        });

        const saved = await newDoc.save();
        res.status(201).json(saved.toJSON());
    } catch (error) {
        console.error("POST /hub error:", error);
        res.status(500).json({ error: "Failed to create link or quick asset" });
    }
});

// PUT update link or quick asset
router.put("/:id", async (req, res) => {
    try {
        const { title, url, category, description, collection, favorite, readLater, badge, logoUrl, bannerUrl } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }
        if (!url || !url.trim()) {
            return res.status(400).json({ error: "URL is required" });
        }

        const isQuick = collection === "Quick Assets" ||
            (category && (category === "Featured Quick Asset" || category === "Quick Assets" || category.toLowerCase().includes("quick")));

        const updateData = {
            title: title.trim(),
            url: url.trim(),
            category: category ? category.trim() : (isQuick ? "Featured Quick Asset" : "General"),
            description: description ? description.trim() : "",
            collection: collection ? collection.trim() : (isQuick ? "Quick Assets" : "All Links"),
            favorite: Boolean(favorite),
            readLater: Boolean(readLater)
        };
        if (badge !== undefined) updateData.badge = badge;
        if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
        if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;

        let updated = await QuickAsset.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updated) {
            updated = await Link.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );
        }

        if (!updated) {
            return res.status(404).json({ error: "Link/Asset not found to update" });
        }

        res.json(updated.toJSON());
    } catch (error) {
        console.error("PUT /hub/:id error:", error);
        res.status(500).json({ error: "Failed to update link" });
    }
});

// DELETE link or quick asset
router.delete("/:id", async (req, res) => {
    try {
        let deleted = await QuickAsset.findByIdAndDelete(req.params.id);
        if (!deleted) {
            deleted = await Link.findByIdAndDelete(req.params.id);
        }
        if (!deleted) {
            return res.status(404).json({ error: "Link/Asset not found to delete" });
        }
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("DELETE /hub/:id error:", error);
        res.status(500).json({ error: "Failed to delete link" });
    }
});

module.exports = router;
