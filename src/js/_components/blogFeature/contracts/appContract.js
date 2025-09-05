/**
 * @file appContract.js
 */
export default class AppContract {
  constructor() {
    if (new.target === AppContract) {
      throw new TypeError(
        "Cannot instantiate abstract class AppContract directly.",
      );
    }
  }

  /**
   * Initialize the app.
   */
  init() {
    throw new Error("Method 'init()' must be implemented by subclass.");
  }

  /**
   * Clean up resources.
   */
  destroy() {
    throw new Error("Method 'destroy()' must be implemented by subclass.");
  }
}
