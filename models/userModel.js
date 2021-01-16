const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must fill the name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "You must fill the email"],
  },
  password: {
    type: String,
    required: [true, "You must fill the password"],
    minLength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["Member", "Admin"],
    default: "Member",
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//this will find active users.
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.role = "Member";
  next();
});

//this will return true or false
userSchema.methods.correctPassword = async function (
  requestPassword,
  userPassword
) {
  return await bcrypt.compare(requestPassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
