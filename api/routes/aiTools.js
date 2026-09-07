const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const AITool = require('../models/AITool');

// Get all AI Tools
router.get('/', async (req, res) => {
  try {
    const tools = await AITool.find().sort({ createdAt: -1 });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new AI Tool
router.post('/', async (req, res) => {
  const tool = new AITool(req.body);
  try {
    const newTool = await tool.save();
    res.status(201).json(newTool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an AI Tool
router.put('/:id', async (req, res) => {
  try {
    const update = { $set: req.body };
    const options = { new: true, runValidators: true, strict: false };
    const idFilter = mongoose.isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { toolId: req.params.id };
    let updatedTool = await AITool.findOneAndUpdate(idFilter, update, options);

    // Seeded tools may use a string-like id, so fall back to their stable toolId.
    if (!updatedTool && req.body.toolId) {
      updatedTool = await AITool.findOneAndUpdate(
        { toolId: req.body.toolId },
        update,
        options,
      );
    }

    if (!updatedTool) return res.status(404).json({ message: 'Tool not found' });
    res.json(updatedTool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an AI Tool
router.delete('/:id', async (req, res) => {
  try {
    const tool = await AITool.findByIdAndDelete(req.params.id);
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
