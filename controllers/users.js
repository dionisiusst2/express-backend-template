const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc        Get all user
// @route       GET /api/v1/users
// @access      Private, admin only
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({ sucess: true, data: users });
});

// @desc        Get single user
// @route       GET /api/v1/users/:id
// @access      Private, admin only
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id ${id}`));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc        Get single user
// @route       PUT /api/v1/users
// @access      Private, user only
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id ${id}`));
  }

  res.status(200).json({ success: true, data: user });
});

// @desc        Create new user
// @route       POST /api/v1/users
// @access      Private, admin only
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({ success: true, data: user });
});
