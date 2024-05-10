const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { NOT_FOUND_STATUS_CODE } = require("./utils/errors");
const { createUser, login } = require("./controllers/user");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const { PORT = 3001 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signin", login);
app.post("/signup", createUser);
app.use("/", require("./routes/index"));

app.use((req, res) =>
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" })
);

app.listen(PORT, () => {
  console.log("Link to the server");
});
