const { NO_PERMISSION_CODE } = require("./errors");

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NO_PERMISSION_CODE;
    this.name = "Forbidden";
  }
}

module.exports = ForbiddenError;
