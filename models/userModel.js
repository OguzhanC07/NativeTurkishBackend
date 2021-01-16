const crypto = require("crypto");
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
    enum: ["user", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.role = "user";
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
