/**
 * errors.js
 */
export class AudioLoopsFetcherError extends Error {
  constructor(message) {
    super(message);
    this.name = "AudioLoopsFetcherError";
  }
}

export class BlogPostNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "BlogPostNotFoundError";
  }
}
