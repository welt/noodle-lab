/**
 * @file logger.js
 * Abstract class for loggers.
 * @abstract
 */

export default class Logger {
  constructor() {
    if (new.target === Logger) {
      throw new Error("Cannot instantiate abstract Logger class directly.");
    }
  }

  /**
   * @param {String} str
   */
  /* eslint-disable no-unused-vars */
  log(str) {
    throw new Error("Method 'log(str)' should be overridden in the subclass.");
  }
}
