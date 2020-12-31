const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

const { isAuth, isGuest, isRole } = require('../middleware/auth');

router.post('/register', isGuest, register);
router.post('/login', isGuest, login);
router.get('/me', isAuth, getMe);
router.get('/logout', isAuth, logout);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:resetToken', resetPassword);

module.exports = router;
