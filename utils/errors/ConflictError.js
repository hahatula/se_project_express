const { DUPLICATE_ERROR_STATUS_CODE } = require("./errors");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DUPLICATE_ERROR_STATUS_CODE;
    this.name = "ConflictError";
  }
}

module.exports = ConflictError;
