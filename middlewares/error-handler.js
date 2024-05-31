const { SERVER_ERROR_STATUS_CODE } = require("../utils/errors/errors");

module.exports = (err, req, res, next) => {
  console.log("something happend");
  console.error(err);
  const { statusCode = SERVER_ERROR_STATUS_CODE, message } = err;
  res.status(statusCode).send({
    // check the status and display a message based on it
    message:
      statusCode === SERVER_ERROR_STATUS_CODE
        ? "An error occurred on the server"
        : message,
  });
};
