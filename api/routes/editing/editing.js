const express = require('express');
const router = express.Router();
const Editing = require('./page');

function ensureProtocol(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

router.get('/', async (req, res) => {
  try {
    const { search, category, collection } = req.query;
    const query = {};

    if (search && String(search).trim()) {
      const searchValue = String(search).trim();
      const searchRegex = new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: searchRegex },
        { url: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    if (category && String(category).trim() && String(category).trim() !== 'All' && String(category).trim() !== 'all') {
      query.category = new RegExp(String(category).trim(), 'i');
    }

    if (collection && String(collection).trim()) {
      query.collection = new RegExp(String(collection).trim(), 'i');
    }

    const items = await Editing.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('GET /editing error:', error);
    res.status(500).json({ error: 'Failed to fetch editing items' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Editing.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Editing item not found' });
    }
    res.json(item.toJSON());
  } catch (error) {
    console.error('GET /editing/:id error:', error);
    res.status(500).json({ error: 'Failed to fetch editing item' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, url, category, description, collection, badge, logoUrl, bannerUrl, favorite, readLater } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!url || !String(url).trim()) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const normalizedUrl = ensureProtocol(String(url).trim());
    if (!normalizedUrl) {
      return res.status(400).json({ error: 'URL is invalid' });
    }

    const existing = await Editing.findOne({ url: normalizedUrl });
    if (existing) {
      return res.status(409).json({ error: 'This editing item already exists', item: existing.toJSON() });
    }

    const item = new Editing({
      title: String(title).trim(),
      url: normalizedUrl,
      category: category ? String(category).trim() : 'Editing',
      description: description ? String(description).trim() : '',
      collection: collection ? String(collection).trim() : 'Editing',
      badge: badge ? String(badge).trim() : '',
      logoUrl: logoUrl ? String(logoUrl).trim() : '',
      bannerUrl: bannerUrl ? String(bannerUrl).trim() : '',
      favorite: Boolean(favorite),
      readLater: Boolean(readLater)
    });

    const saved = await item.save();
    res.status(201).json(saved.toJSON());
  } catch (error) {
    console.error('POST /editing error:', error);
    res.status(500).json({ error: 'Failed to create editing item' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, url, category, description, collection, badge, logoUrl, bannerUrl, favorite, readLater } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!url || !String(url).trim()) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const normalizedUrl = ensureProtocol(String(url).trim());
    if (!normalizedUrl) {
      return res.status(400).json({ error: 'URL is invalid' });
    }

    const updated = await Editing.findByIdAndUpdate(
      req.params.id,
      {
        title: String(title).trim(),
        url: normalizedUrl,
        category: category ? String(category).trim() : 'Editing',
        description: description ? String(description).trim() : '',
        collection: collection ? String(collection).trim() : 'Editing',
        badge: badge ? String(badge).trim() : '',
        logoUrl: logoUrl ? String(logoUrl).trim() : '',
        bannerUrl: bannerUrl ? String(bannerUrl).trim() : '',
        favorite: Boolean(favorite),
        readLater: Boolean(readLater)
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Editing item not found' });
    }

    res.json(updated.toJSON());
  } catch (error) {
    console.error('PUT /editing/:id error:', error);
    res.status(500).json({ error: 'Failed to update editing item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Editing.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Editing item not found' });
    }
    res.json({ message: 'Editing item deleted successfully' });
  } catch (error) {
    console.error('DELETE /editing/:id error:', error);
    res.status(500).json({ error: 'Failed to delete editing item' });
  }
});

module.exports = router;
