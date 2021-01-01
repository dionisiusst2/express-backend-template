const express = require('express');
const { updateUserDetail } = require('../controllers/users');
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
} = require('../controllers/users');

const { isAuth, isRole } = require('../middleware/auth');

router.use(isAuth);

router
  .route('/')
  .get(isRole('admin'), getUsers)
  .post(isRole('admin'), createUser)
  .put(isRole('user'), updateUser);
router.route('/:id').get(isRole('admin'), getUser);

module.exports = router;
