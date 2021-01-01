const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadPhoto,
} = require('../controllers/products');

const { isAuth, isRole } = require('../middleware/auth');

router.route('/').get(getProducts).post(isAuth, isRole('admin'), createProduct);
router
  .route('/:id')
  .get(getProduct)
  .put(isAuth, isRole('admin'), updateProduct)
  .delete(isAuth, isRole('admin'), deleteProduct);
router.route('/:id/photo').put(isAuth, isRole('admin'), uploadPhoto);

module.exports = router;
