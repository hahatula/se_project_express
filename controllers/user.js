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

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("Requested resource not found");
      error.name = "NotFoundError";
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      console.error(err.name);
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
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.ststus(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      res.status(AUTH_ERROR_STATUS_CODE).send({ message: err.message });
    });
};
