const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name cannot be empty'],
    minLength: [5, 'Product name must be at least 5 characters'],
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
    default: null,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
});

ProductSchema.methods.cloneAttributes = function () {
  const attributes = {
    name: this.name,
    price: this.price,
    photo: this.photo,
  };

  return attributes;
};

module.exports = mongoose.model('Product', ProductSchema);
