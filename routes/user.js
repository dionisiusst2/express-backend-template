const express = require('express');
const { updateUserDetail } = require('../controllers/users');
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  uploadPhoto,
  updatePassword,
} = require('../controllers/users');

const { isAuth, isRole } = require('../middleware/auth');

router.use(isAuth);

router
  .route('/')
  .get(isRole('admin'), getUsers)
  .post(isRole('admin'), createUser)
  .put(isRole('user'), updateUser);
router.route('/:id').get(isRole('admin'), getUser);
router.route('/photo').put(isRole('user'), uploadPhoto);
router.route('/password').put(isRole('user'), updatePassword);

module.exports = router;
