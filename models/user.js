const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    select: false,
    validate: {
      validator(value) {
        return validator.isStrongPassword(value);
      },
      message: "Please enter stronger password",
    },
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  const errNotMatched = new Error("Incorrect email or password");
  errNotMatched.name = "NotCorrectCredentials";
  const errNotEnough = new Error("Email or password is missing");
  errNotEnough.name = "NoEmailOrPassword";
  console.log(email, password);

  if (!email || !password) {
    return Promise.reject(errNotEnough);
  }
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(errNotMatched);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(errNotMatched);
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
