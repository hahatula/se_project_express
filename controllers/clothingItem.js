const ClothingItem = require("../models/clothingItem");

module.exports.getItems = (req, res) => {
  ClothingItem.find({})
    .orFail(() => {
      const error = new Error("Requested resource not found");
      error.name = "NotFoundError";
      throw error; // Remember to throw an error so .catch handles it instead of .then
    })
    .populate(["owner", "likes"])
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
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
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.id)
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      console.error(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};
