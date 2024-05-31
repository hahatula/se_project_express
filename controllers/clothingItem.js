const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const NotFoundError = require("../utils/errors/NotFoundError");

module.exports.getItems = (req, res, next) => {
  ClothingItem.find({})
    .populate(["owner", "likes"])
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

module.exports.createItem = (req, res, next) => {
  const { name, weather, imageUrl, userId = req.user._id } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: userId,
  })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports.deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => {
      throw new NotFoundError("Requested resource not found");
    })
    .then((item) => {
      if (item.owner.equals(req.user._id)) {
        item
          .delete()
          .then(() =>
            res.send({ message: "The item was successfully deleted." })
          );
      } else {
        throw new ForbiddenError("No permission");
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports.likeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Requested resource not found");
    })
    .populate(["owner", "likes"])
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });

module.exports.dislikeItem = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .populate(["owner", "likes"])
    .orFail(() => {
      throw new NotFoundError("Requested resource not found");
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
