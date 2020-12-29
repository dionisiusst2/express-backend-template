const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name cannot be empty'],
    min: [5, 'Product name must be at least 5 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price cannot be empty'],
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  validBefore: {
    type: Date,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
