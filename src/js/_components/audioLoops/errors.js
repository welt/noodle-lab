/**
 * errors.js
 */
export class AudioLoopsFetcherError extends Error {
  constructor(message) {
    super(message);
    this.name = "AudioLoopsFetcherError";
  }
}

export class AudioLoopsControllerError extends Error {
  constructor(message) {
    super(message);
    this.name = "AudioLoopsControllerError";
  }
}
