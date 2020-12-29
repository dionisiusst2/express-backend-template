const mongoose = require('mongoose');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc        Get all products
// @route       GET /api/v1/products
// @access      Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

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
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  isProductExists(product, next);

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc        Delete existing product
// @route       DELETE api/v1/products/:id
// @access      Private, Admin only
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  isProductExists(product, next);

  await product.remove();

  res.status(200).json({
    success: true,
    data: [],
  });
});

const isProductExists = (product, next) => {
  if (!product) {
    return next(new ErrorResponse(`Product not found`, 404));
  }
};
