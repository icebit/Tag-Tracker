const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ lastSeen: -1 });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new tag
router.post('/', async (req, res) => {
  const tag = new Tag({
    id: req.body.id,
    name: req.body.name,
    status: req.body.status,
    location: req.body.location,
    lastSeen: req.body.lastSeen || new Date()
  });

  try {
    const newTag = await tag.save();
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update tag
router.patch('/:id', async (req, res) => {
  try {
    const tag = await Tag.findOne({ id: req.params.id });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    if (req.body.status) tag.status = req.body.status;
    if (req.body.location) tag.location = req.body.location;
    if (req.body.lastSeen) tag.lastSeen = req.body.lastSeen;
    if (req.body.name) tag.name = req.body.name;

    const updatedTag = await tag.save();
    res.json(updatedTag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 