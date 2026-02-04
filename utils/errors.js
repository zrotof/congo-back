class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends CustomError {
  constructor(message = "Invalid data") {
    super(message);
    this.status = 400;
  }
}

class AccountNotValidatedError extends Error {
  constructor(message = "AccountNotValidatedError") {
      super(message);
      this.status = 403;
  }
}

class AuthenticationError extends CustomError {
  constructor(message = "Authentication required") {
    super(message);
    this.status = 401;
  }
}

class AuthorizationError extends CustomError {
  constructor(message = "Not authorized") {
    super(message);
    this.status = 403;
  }
}

class DatabaseError extends CustomError {
  constructor(message = "Database error") {
    super(message);
    this.status = 500;
  }
}


class InvalidCredentialsError extends Error {
  constructor(message= "InvalidCredentialsError",) {
    super(message);
    this.status = 401;
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message);
    this.status = 404;
  }
}

class TooManyAttemptsError extends Error {
  constructor(message = "TooManyAttemptsError") {
      super(message);
      this.status = 429;
  }
}

module.exports = {
  CustomError,
  ValidationError,
  AccountNotValidatedError,
  AuthenticationError,
  AuthorizationError,
  DatabaseError,
  InvalidCredentialsError,
  NotFoundError,
  TooManyAttemptsError
}