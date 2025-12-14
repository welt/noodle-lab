/**
 * errors.js
 */
export class AudioFetcherError extends Error {
  constructor(message) {
    super(message);
    this.name = "AudioFetcherError";
  }
}

export class AudioControllerError extends Error {
  constructor(message) {
    super(message);
    this.name = "AudioControllerError";
  }
}
