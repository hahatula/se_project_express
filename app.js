const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { NOT_FOUND_STATUS_CODE } = require("./utils/errors/errors");
const errorHandler = require("./middlewares/error-handler");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", require("./routes/index"));

app.use((req, res) =>
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" })
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Link to the server");
});
