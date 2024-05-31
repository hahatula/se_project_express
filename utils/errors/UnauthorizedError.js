const { AUTH_ERROR_STATUS_CODE } = require("./errors");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTH_ERROR_STATUS_CODE;
    this.name = "UnauthorizedError";
  }
}

module.exports = UnauthorizedError;
