const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema({
  location: String,
  timestamp: { type: Date, default: Date.now }
});

const tagSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
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
  locationHistory: [locationHistorySchema]
});

module.exports = mongoose.model('Tag', tagSchema); 