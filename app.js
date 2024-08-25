const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const { errors } = require("celebrate");
const helmet = require("helmet");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { limiter } = require("./middlewares/limiter");

const { MONGO_URI } = process.env;

// mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
mongoose.connect(MONGO_URI);

//change port to 3001 to run locally
const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.use("/", require("./routes/index"));

app.use(errorLogger);

// error handlers
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Link to the server");
});
