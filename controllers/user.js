const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../utils/errors/BadRequestError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");

const { NODE_ENV, JWT_SECRET } = process.env;

// module.exports.getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.send({ data: users }))
//     .catch((err) => {
//       console.error(err);
//       return next(err);
//     });
// };

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password, city, coordinates } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash, city, coordinates }))
    .then((user) =>
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email, city: user.city, coordinates: user.coordinates })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "MongoServerError" && err.code === 11000) {
        return next(new ConflictError("The user already exists."));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password) // method from user schema
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: "7d",
        }
      );
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "NotCorrectCredentials") {
        return next(new UnauthorizedError("Wrong email or password"));
      }
      if (err.name === "NoEmailOrPassword") {
        return next(new BadRequestError("No email or password"));
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError("Requested resource not found");
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, avatar, city, coordinates } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar, city, coordinates },
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
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};
