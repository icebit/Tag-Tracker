const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  value: Number,
  owner: String,
  purchaseDate: Date,
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema); 