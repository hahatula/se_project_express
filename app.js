//const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db',
// {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// }
);

const { PORT = 3003, BASE_PATH } = process.env;
const app = express();

//app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log("Link to the server");
  console.log(BASE_PATH);
});
