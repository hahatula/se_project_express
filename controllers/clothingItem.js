const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

module.exports.getItems = (req, res) => {
  ClothingItem.find({})
    .populate(["owner", "likes"])
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      console.error(err.name);
      if (err.name === "NotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

module.exports.createItem = (req, res) => {
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
        return res
          .status(INVALID_DATA_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

module.exports.deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndRemove(itemId)
    .orFail(() => {
      const error = new Error("Requested resource not found");
      error.name = "NotFoundError";
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then(() => res.status(200).send({}))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_STATUS_CODE)
          .send({ message: err.message });
      }
      if (err.name === "NotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

module.exports.likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Requested resource not found");
      error.name = "NotFoundError";
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_STATUS_CODE)
          .send({ message: err.message });
      }
      if (err.name === "NotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });

module.exports.dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Requested resource not found");
      error.name = "NotFoundError";
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.log(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_STATUS_CODE)
          .send({ message: err.message });
      }
      if (err.name === "NotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
