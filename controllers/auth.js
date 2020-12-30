const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  sendResponseWithToken(user, 200, res);
});

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

exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).clearCookie('token').json({ success: true, data: [] });
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
