const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  available: {
    type: Number,
    default: 1
  },
  location: {
    type: String, // e.g. Shelf A-1
    required: true
  },
  coverUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', bookSchema);
