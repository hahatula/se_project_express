const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Please enter your email",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isStrongPassword(value);
      },
      message: "Please enter stronger password",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
