/**
 * @file wizardModal.js
 */
import PlainModalDialog from "../../_contracts/plainModalDialog.js";
import { render as renderMessage } from "./render.js";

export default class WizardModal extends PlainModalDialog {
  constructor() {
    super();
    this.dialog = null;
    this.content = null;
    this.closeBtn = null;
  }

  connectedCallback() {
    this.innerHTML = `
      <dialog data-modal>
        <div data-modal-content>hello monkey</div>
        <button data-modal-close>Close</button>
      </dialog>
    `;
    this.dialog = this.querySelector("dialog");
    this.content = this.querySelector("[data-modal-content]");
    this.closeBtn = this.querySelector("[data-modal-close]");

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }
  }

  show(message) {
    this.render(message);
    if (this.dialog) {
      this.dialog.showModal();
    }
  }

  close() {
    if (this.dialog) {
      this.dialog.close();
    }
  }

  render(message) {
    renderMessage(this.content, message);
  }
}
