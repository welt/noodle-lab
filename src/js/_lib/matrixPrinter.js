/**
 * @file matrixPrinter.js
 * Teletype typing effect.
 */
import Printer from "../_contracts/printer";

const TIME_BETWEEN_CHARS_MS = 50;

export default class MatrixPrinter extends Printer {
  constructor(delay = TIME_BETWEEN_CHARS_MS) {
    super();
    this.delay = delay;
    this.currentAnimation = null;

    // Internal state for the active print promise so cancel() can reject it
    this._currentResolve = null;
    this._currentReject = null;
    this._accumulated = "";
    this._currentIndex = 0;
  }

  /**
   * Prints message character by character with delay between each character.
   * @param {String} message - The message to print
   * @param {Function} callback - Called with the accumulated string after each character
   * @returns {Promise<String>} Resolves with final text on success, rejects with Error("Print cancelled") on cancel
   */
  print(message, callback) {
    // If there's an ongoing animation, clear the timeout and reject its promise
    if (this.currentAnimation) {
      clearTimeout(this.currentAnimation);
      this.currentAnimation = null;
    }
    if (this._currentReject) {
      // Reject the previous promise to notify callers that it was cancelled
      try {
        this._currentReject(new Error("Print cancelled"));
      } catch (e) {
        // swallow any unexpected errors from previously stored reject
      }
      this._currentResolve = null;
      this._currentReject = null;
      this._accumulated = "";
      this._currentIndex = 0;
    }

    return new Promise((resolve, reject) => {
      // Store resolve/reject so cancel() can reject the promise if needed
      this._currentResolve = resolve;
      this._currentReject = reject;
      this._currentIndex = 0;
      this._accumulated = "";

      const cleanupState = () => {
        // centralize cleanup to avoid duplication
        if (this.currentAnimation) {
          clearTimeout(this.currentAnimation);
          this.currentAnimation = null;
        }
        this._currentResolve = null;
        this._currentReject = null;
        this._accumulated = "";
        this._currentIndex = 0;
      };

      const printNextChar = () => {
        if (this._currentIndex < message.length) {
          this._accumulated += message[this._currentIndex];

          // Safely call the callback; if it throws, reject and stop animation.
          try {
            callback(this._accumulated);
          } catch (err) {
            // Stop scheduling further frames and reject the promise with the error.
            cleanupState();
            // Reject only if reject is still present (defensive)
            try {
              reject(err);
            } catch (e) {
              // swallow any errors thrown by reject
            }
            return;
          }

          this._currentIndex++;
          this.currentAnimation = setTimeout(printNextChar, this.delay);
        } else {
          // Completed normally
          cleanupState();
          resolve(message); // resolve with original message (final text)
        }
      };

      printNextChar();
    });
  }

  cancel() {
    // Clear any scheduled timeout
    if (this.currentAnimation) {
      clearTimeout(this.currentAnimation);
      this.currentAnimation = null;
    }

    // If there's a pending promise, reject it to signal cancellation
    if (this._currentReject) {
      const reject = this._currentReject;
      // Clear stored state first to avoid double-calls
      this._currentResolve = null;
      this._currentReject = null;
      this._accumulated = "";
      this._currentIndex = 0;
      try {
        reject(new Error("Print cancelled"));
      } catch (e) {
        // swallow unexpected errors from reject
      }
    }
  }

  setDelay(delay) {
    this.delay = delay;
  }
}
