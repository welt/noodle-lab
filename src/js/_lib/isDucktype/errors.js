/**
 * @file error.js
 * Custom errors for duck typing utility.
 */
class DuckTypingError extends TypeError {
  constructor(
    message = `The object does not have the expected properties`,
    details = {},
  ) {
    super(message);
    this.name = "DuckTypingError";
    this.details = details;
  }
}

export { DuckTypingError };
