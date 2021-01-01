const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const path = require('path');

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

// @desc        Create new user
// @route       POST /api/v1/users
// @access      Private, admin only
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

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

// @desc        Update profile picture
// @route       PUT /api/v1/users/photo
// @access      Private, user only
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`No files were uploaded`, 400));
  }
  console.log(req.files);

  let file = req.files.photo;

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${
          process.env.MAX_FILE_UPLOAD / 1000
        }Mb`
      )
    );
  }

  file.name = `photo_${req.user.id}${path.parse(file.name).ext}`;

  file.mv(
    `${process.env.PROFILE_PICTURE_UPLOAD_PATH}/${file.name}`,
    async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with fileupload`, 500));
      }

      await User.findByIdAndUpdate(req.user.id, { photo: file.name });

      res.status(200).json({
        success: true,
        data: file.name,
      });
    }
  );
});
