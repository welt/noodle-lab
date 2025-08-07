/**
 * @file errorDialog.js
 * ErrorDialog component extending EncapsulatedModalDialog,
 * using the Shadow DOM and native <dialog>.
 */
import EncapsulatedModalDialog from "../_contracts/encapsulatedModalDialog.js";

export default class ErrorDialog extends EncapsulatedModalDialog {
  constructor() {
    super();
    this._message = "";
    this.render();
  }

  show(message) {
    this.render(message);
    if (!this.dialog.open) {
      this.dialog.showModal();
    }
  }

  close() {
    if (this.dialog && this.dialog.open) {
      this.dialog.close();
    }
  }

  render(message = "") {
    // Only render the dialog structure once
    if (!this.shadowRoot.querySelector("dialog")) {
      this.shadowRoot.innerHTML = `
        <style>
          dialog {
            padding: 2em;
            border: none;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-family: inherit;
            min-width: 250px;
            max-width: 90vw;
          }
          .error-message {
            margin-bottom: 1.5em;
            color: #b00020;
            font-weight: bold;
          }
          button {
            padding: 0.5em 1.2em;
            border: none;
            border-radius: 4px;
            background: #b00020;
            color: #fff;
            font-size: 1em;
            cursor: pointer;
          }
        </style>
        <dialog aria-label="Error message">
          <div class="error-message"></div>
          <form method="dialog">
            <button type="submit">Close</button>
          </form>
        </dialog>
      `;
      this.dialog = this.shadowRoot.querySelector("dialog");
      this.messageDiv = this.shadowRoot.querySelector(".error-message");
      this.dialog.addEventListener("close", this.#onClose.bind(this));
    }
    if (typeof message === "string" && message.length > 0) {
      this.messageDiv.textContent = message;
    }
  }

  #onClose() {
    // Clear the message if required.
    this.messageDiv.textContent = "";
  }
}
