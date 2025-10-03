/* eslint-disable no-unused-vars */

/**
 * @file modalDialog.js
 * Pseudo-abstract contract class for modal dialog components.
 * Extend this class to implement custom dialogs.
 */

export default class ModalDialog extends HTMLElement {
  constructor() {
    super();
    if (new.target === ModalDialog) {
      throw new TypeError(
        "Cannot instantiate abstract class ModalDialog directly.",
      );
    }
    this.dialog = null; // Reference to the native <dialog> element
  }

  /**
   * Show the dialog with the given message/content.
   * @param {string} message - The message or HTML content to display.
   */
  show(message) {
    throw new Error("Method 'show(message)' must be implemented by subclass.");
  }

  /**
   * Close the dialog.
   */
  close() {
    throw new Error("Method 'close()' must be implemented by subclass.");
  }

  /**
   * Set auto-close time (in ms).
   * Subclasses must implement this.
   */
  autoClose(milliseconds) {
    throw new Error("PlainModalDialog.autoClose() must be implemented by subclass");
  }

  /**
   * Optionally, subclasses can implement this to render dialog content.
   * @param {string} message
   */
  render(message) {
    throw new Error(
      "Method 'render(message)' must be implemented by subclass.",
    );
  }
}
