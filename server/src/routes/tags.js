const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new tag
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
    // Emit new tag event to all connected clients
    req.app.get('io').emit('new_tag', newTag);
    res.status(201).json(newTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update tag status
router.patch('/:id', async (req, res) => {
  try {
    const tag = await Tag.findOne({ id: req.params.id });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    if (req.body.status) {
      tag.status = req.body.status;
    }
    if (req.body.location) {
      tag.location = req.body.location;
      tag.lastSeen = new Date();
    }

    const updatedTag = await tag.save();
    // Emit tag update event to all connected clients
    req.app.get('io').emit('tag_update', updatedTag);
    res.json(updatedTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get tag location history
router.get('/:id/history', async (req, res) => {
  try {
    const tag = await Tag.findOne({ id: req.params.id });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json(tag.locationHistory || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 