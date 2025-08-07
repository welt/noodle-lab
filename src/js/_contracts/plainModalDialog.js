/**
 * @file plainModalDialog.js
 * PlainModalDialog contract for modal dialog components
 * using Light DOM.
 */
import ModalDialog from "./modalDialog.js";

export default class PlainModalDialog extends ModalDialog {
  constructor() {
    super();
    if (new.target === PlainModalDialog) {
      throw new TypeError(
        "Cannot instantiate abstract class PlainModalDialog directly.",
      );
    }
    this.dialog = null;
  }

  /**
   * Subclasses must implement this to show the dialog.
   * @param {string} message - The message or HTML content to display.
   */
  show(message) {
    super.show(message);
  }

  /**
   * Subclasses must implement this to close the dialog.
   */
  close() {
    super.close();
  }

  /**
   * Subclasses must implement this to render dialog content.
   * @param {string} message
   */
  render(message) {
    super.render(message);
  }
}
