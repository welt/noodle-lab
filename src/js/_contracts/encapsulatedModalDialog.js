/**
 * @file encapsulatedModalDialog.js
 * EncapsulatedModalDialog contract class for modal dialogs
 * using Shadow DOM for encapsulation.
 */
import ModalDialog from "./modalDialog.js";

export default class EncapsulatedModalDialog extends ModalDialog {
  constructor() {
    super();
    if (new.target === EncapsulatedModalDialog) {
      throw new TypeError(
        "Cannot instantiate abstract class EncapsulatedModalDialog directly.",
      );
    }
    this.attachShadow({ mode: "open" });
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
