/**
 * errors.js
 */
export class BlogPostValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "BlogPostValidationError";
  }
}

export class BlogPostNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "BlogPostNotFoundError";
  }
}
