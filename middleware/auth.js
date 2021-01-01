const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.isAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse(`Not authorized to access this page`, 401));
  }

  try {
    // Token contains the logged in user id
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id);
    next();
  } catch (err) {
    return next(new ErrorResponse(`Not authorized to access this page`, 401));
  }
});

exports.isGuest = asyncHandler(async (req, res, next) => {
  let token;
  if (!req.cookies.token) {
    return next();
  } else {
    token = req.cookies.token;
  }

  try {
    // Token contains the logged in user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    // If token is valid and user exists,
    if (user) {
      return next(new ErrorResponse(`Access route is forbidden`, 403));
    }
  } catch (err) {}
  next();
});

exports.isRole = (...role) => {
  return (req, res, next) => {
    const isAuthorized = role.includes(req.user.role);

    if (!isAuthorized) {
      return next(new ErrorResponse(`Not authorized to access this page`, 401));
    }

    next();
  };
};
