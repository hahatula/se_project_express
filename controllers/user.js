const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  INVALID_DATA_STATUS_CODE,
  AUTH_ERROR_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  DUPLICATE_ERROR_STATUS_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// module.exports.getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.send({ data: users }))
//     .catch((err) => {
//       console.error(err);
//       return res
//         .status(SERVER_ERROR_STATUS_CODE)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "MongoServerError" && err.code === 11000) {
        return res
          .status(DUPLICATE_ERROR_STATUS_CODE)
          .send({ message: "The user already exists." });
      }
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA_STATUS_CODE)
          .send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password) // method from user schema
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "NotCorrectCredentials") {
        return res
          .status(AUTH_ERROR_STATUS_CODE)
          .send({ message: "Wrong email or password" });
      }
      if (err.name === "NoEmailOrPassword") {
        return res
          .status(INVALID_DATA_STATUS_CODE)
          .send({ message: "No email or password" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => {
      const error = new Error("Requested resource not found");
      error.name = "NotFoundError";
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_STATUS_CODE)
          .send({ message: "Invalid data" });
      }
      if (err.name === "NotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA_STATUS_CODE)
          .send({ message: "Invalid data" });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};
