const mongoose = require('mongoose');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc        Get all products
// @route       GET /api/v1/products
// @access      Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({
    validBefore: undefined,
  });

  res.status(200).json({
    success: true,
    data: products,
  });
});

// @desc        Get single product
// @route       GET /api/v1/products/:id
// @access      Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  isProductExists(product, next);

  return res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc        Create new product
// @route       POST api/v1/products
// @access      Private, Admin only
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc        Update existing product
// @route       PUT api/v1/products/:id
// @access      Private, Admin only
exports.updateProduct = asyncHandler(async (req, res, next) => {
  // Update existing product and make it no longer valid
  const deprecatedProduct = await deprecateProductById(req.params.id);

  isProductExists(deprecatedProduct, next);

  // Create a new product with deprecated product attributes
  let newProduct = await Product.create(deprecatedProduct.cloneAttributes());

  // Update the attributes on the new product
  newProduct = await Product.findByIdAndUpdate(newProduct._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: newProduct,
  });
});

// @desc        Delete existing product
// @route       DELETE api/v1/products/:id
// @access      Private, Admin only
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const deprecatedProduct = await deprecateProductById(req.params.id);

  isProductExists(deprecatedProduct, next);

  res.status(200).json({
    success: true,
    data: deprecatedProduct,
  });
});

const deprecateProductById = async (id) => {
  const updateField = {
    validBefore: Date.now(),
    isValid: false,
  };

  return await Product.findByIdAndUpdate(id, updateField, {
    new: true,
    runValidators: true,
  });
};

const isProductExists = (product, next) => {
  if (!product) {
    return next(new ErrorResponse(`Product not found`, 404));
  }
};
