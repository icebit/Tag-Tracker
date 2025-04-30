const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const Item = require('../models/Item');

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find()
      .populate('item', 'name description')
      .sort({ lastSeen: -1 });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new tag
router.post('/', async (req, res) => {
  try {
    console.log('Received tag creation request:', req.body);

    // Validate required fields
    if (!req.body.epc) {
      console.log('Missing EPC');
      return res.status(400).json({ message: 'EPC is required' });
    }
    if (!req.body.item) {
      console.log('Missing item');
      return res.status(400).json({ message: 'Item is required' });
    }

    // Check if item exists
    const item = await Item.findById(req.body.item);
    if (!item) {
      console.log('Item not found:', req.body.item);
      return res.status(400).json({ message: 'Item not found' });
    }

    // Check if tag with same EPC already exists
    const existingTag = await Tag.findOne({ epc: req.body.epc });
    if (existingTag) {
      console.log('Tag with EPC already exists:', req.body.epc);
      return res.status(400).json({ message: 'Tag with this EPC already exists' });
    }

    const tag = new Tag({
      epc: req.body.epc,
      status: req.body.status || 'inStock',
      location: req.body.location || '',
      lastSeen: req.body.lastSeen || new Date(),
      item: req.body.item
    });

    console.log('Creating new tag:', tag);

    const newTag = await tag.save();

    // Add tag to item's tags array
    item.tags.push(newTag._id);
    await item.save();

    console.log('Tag created successfully:', newTag);
    res.status(201).json(newTag);
  } catch (err) {
    console.error('Error creating tag:', err);
    res.status(400).json({ 
      message: 'Error creating tag',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Update tag
router.patch('/:id', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // If updating item, validate it exists
    if (req.body.item) {
      const item = await Item.findById(req.body.item);
      if (!item) {
        return res.status(400).json({ message: 'Item not found' });
      }
    }

    Object.keys(req.body).forEach(key => {
      tag[key] = req.body[key];
    });

    const updatedTag = await tag.save();
    res.json(updatedTag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete tag
router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Remove tag from item's tags array
    const item = await Item.findById(tag.item);
    if (item) {
      item.tags = item.tags.filter(tagId => tagId.toString() !== tag._id.toString());
      await item.save();
    }

    await tag.deleteOne();
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fix index issue (temporary endpoint)
router.post('/fix-index', async (req, res) => {
  try {
    await Tag.collection.dropIndex('id_1');
    res.json({ message: 'Index fixed successfully' });
  } catch (err) {
    console.error('Error fixing index:', err);
    res.status(500).json({ 
      message: 'Error fixing index',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router; 