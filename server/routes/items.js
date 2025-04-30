const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Tag = require('../models/Tag');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('tags');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new item
router.post('/', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    value: req.body.value,
    owner: req.body.owner,
    purchaseDate: req.body.purchaseDate
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get one item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('tags');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update item
router.patch('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    Object.keys(req.body).forEach(key => {
      item[key] = req.body[key];
    });
    
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete all associated tags
    if (item.tags && item.tags.length > 0) {
      await Tag.deleteMany({ _id: { $in: item.tags } });
    }

    // Use deleteOne instead of remove
    await Item.deleteOne({ _id: req.params.id });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ 
      message: 'Error deleting item',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router; 