const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const { PORT = 3001 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "662e13880b3abf809ed4d27e", // the _id of the test user
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

router.use((req, res) => {
  return res.status(NOT_FOUND_STATUS_CODE).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log("Link to the server");
});
