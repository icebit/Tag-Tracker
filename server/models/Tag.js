const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  epc: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['inStock', 'inTransit', 'delivered', 'lost'],
    default: 'inStock'
  },
  location: {
    type: String,
    default: ''
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  id: false
});

// Index for faster queries
tagSchema.index({ item: 1, isActive: 1 });

module.exports = mongoose.model('Tag', tagSchema); 