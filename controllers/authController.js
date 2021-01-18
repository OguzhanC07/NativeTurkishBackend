const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.Name,
    email: req.body.Email,
    password: req.body.Password,
  });
  res.status(200).json();
});

exports.login = catchAsync(async (req, res, next) => {
  const { Email, Password } = req.body;

  //1-Check Email && password exist
  if (!Email || !Password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2) check if user exist && email-password check
  const user = await User.findOne({ 'email' : Email }).select("+password +role");

  if (!user || !(await user.correctPassword(Password, user.password))) {
    return next(new AppError("Incorret email or password", 401));
  }

  //3- if everything is correct send token
  const token = signToken(user._id);
  res.status(200).json({
    token,
    id: user._id,
    name:user.name,
    role: user.role,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Please log in"), 401);
  }

  //2) validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3)check if user still exists
  const currentUser = await User.findById(decoded.id).select("+role");
  if (!currentUser) {
    return next(new AppError("The user belonging this not exist"), 401);
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission"));
    }
    next();
  };
};
