const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({
    _id:{$ne:req.user._id}
  }).select("-__v");

  res.status(200).json(users);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const _id = req.params.id;
  const user = await User.findOne({ _id });

  res.status(200).json(user);
});

exports.banUsers = catchAsync(async (req, res, next) => {
  const _id = req.params.id;
  await User.findByIdAndUpdate(_id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
