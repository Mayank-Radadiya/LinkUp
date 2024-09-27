class apiError extends Error {
  // High level code ........  :)
  constructor(
    stateCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.stateCode = stateCode;
    this.errors = errors;
    this.data = null;
    this.message = message;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { apiError };
