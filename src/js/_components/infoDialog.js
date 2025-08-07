/**
 * @file infoDialog.js
 * InfoDialog component extending PlainModalDialog,
 * using Light DOM and native <dialog>.
 */
import PlainModalDialog from "../_contracts/plainModalDialog.js";

export default class InfoDialog extends PlainModalDialog {
  constructor() {
    super();
    this.dialog = null;
    this.messageDiv = null;
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
    if (!this.querySelector("dialog")) {
      this.innerHTML = `
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
          .info-message {
            margin-bottom: 1.5em;
            color: #1565c0;
            font-weight: bold;
          }
          button {
            padding: 0.5em 1.2em;
            border: none;
            border-radius: 4px;
            background: #1565c0;
            color: #fff;
            font-size: 1em;
            cursor: pointer;
          }
        </style>
        <dialog aria-label="Information">
          <div class="info-message"></div>
          <form method="dialog">
            <button type="submit">Close</button>
          </form>
        </dialog>
      `;
      this.dialog = this.querySelector("dialog");
      this.messageDiv = this.querySelector(".info-message");
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
