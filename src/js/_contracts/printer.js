/**
 * @file printer.js
 * Abstract base printer class
 */

export default class Printer {
  constructor() {
    if (new.target === Printer) {
      throw new TypeError("Cannot instantiate abstract class Printer directly");
    }
  }

  /**
   * Prints message with the printer's specific behavior.
   * Abstract method - must be implemented by subclasses.
   *
   * @param {String} message - The message to print
   * @param {Function} callback - Called during the printing process with the accumulated/current output
   * @returns {Promise<String>} Promise that resolves with the final message when printing is complete
   * @abstract
   */
  print(message, callback) {
    throw new Error("Abstract method print() must be implemented by subclass");
  }

  /**
   * Cancels the current printing operation.
   * Abstract method - must be implemented by subclasses.
   *
   * @abstract
   */
  cancel() {
    throw new Error("Abstract method cancel() must be implemented by subclass");
  }

  /**
   * Sets the delay/speed for the printer.
   * Optional method - subclasses may override if they support configurable delays.
   *
   * @param {Number} delay - The delay value (meaning varies by implementation)
   */
  setDelay(delay) {
    //
  }
}
