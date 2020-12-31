const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc        Register new user
// @route       POST /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  sendResponseWithToken(user, 200, res);
});

// @desc        Login as user
// @route       POST /api/v1/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse(`Email and password cannot be empty`, 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    return next(new ErrorResponse(`User ${email} does not exists`, 404));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  sendResponseWithToken(user, 200, res);
});

// @desc        Get the logged in user
// @route       GET /api/v1/auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc        Logout and clear cookie
// @route       GET /api/v1/auth/logout
// @access      Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).clearCookie('token').json({ success: true, data: [] });
});

// @desc        Send email containing reset password token
// @route       POST /api/v1/auth/forgotPassword
// @access      Private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse(`There is no user with provided email`, 404));
  }

  let resetToken = user.getResetPasswordToken();

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a GET request to \n\n ${resetUrl}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password reset',
      message,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse('Email could not be send', 500));
  }

  await user.save({ validateBeforeSave: false });
});

// @desc        Reset password
// @route       PUT /api/v1/auth/resetPassword/:resetToken
// @access      Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest();

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ runValidators: false });

  sendResponseWithToken(user, 200, res);
});

const sendResponseWithToken = async (user, statusCode, res) => {
  const token = user.getSignedToken();

  const options = {
    expire: Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 24 * 1000, // 30 day in ms
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token: token,
  });
};
