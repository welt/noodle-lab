/**
 * @file errors.js
 * custom errors for Pixel Mangler
 */
export class WorkerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WorkerError';
  }
}
