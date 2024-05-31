// Status Code Constants
const INVALID_DATA_STATUS_CODE = 400;
const AUTH_ERROR_STATUS_CODE = 401;
const NO_PERMISSION_CODE = 403;
const NOT_FOUND_STATUS_CODE = 404;
const DUPLICATE_ERROR_STATUS_CODE = 409;
const SERVER_ERROR_STATUS_CODE = 500;

// Error Classes
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INVALID_DATA_STATUS_CODE;
    this.name = "BadRequestError";
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTH_ERROR_STATUS_CODE;
    this.name = "UnauthorizedError";
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NO_PERMISSION_CODE;
    this.name = "Forbidden";
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_STATUS_CODE;
    this.name = "NotFoundError";
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DUPLICATE_ERROR_STATUS_CODE;
    this.name = "ConflictError";
  }
}

module.exports = {
  INVALID_DATA_STATUS_CODE,
  AUTH_ERROR_STATUS_CODE,
  NO_PERMISSION_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  DUPLICATE_ERROR_STATUS_CODE,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
