/**
 * @file wizardModal.js
 */
import PlainModalDialog from "../../_contracts/plainModalDialog.js";
import { render as renderMessage } from "./render.js";

export default class WizardModal extends PlainModalDialog {
  #handleCloseClick = () => this.close();

  constructor() {
    super();
    this.dialog = null;
    this.content = null;
    this.closeBtn = null;
  }

  connectedCallback() {
    this.innerHTML = `
      <dialog data-modal>
        <div data-modal-content></div>
        <button data-modal-close>Close</button>
      </dialog>
    `;
    this.dialog = this.querySelector("dialog");
    this.content = this.querySelector("[data-modal-content]");
    this.closeBtn = this.querySelector("[data-modal-close]");
    this.bindEvents();
  }

  disconnectedCallback() {
    this.unbindEvents();
  }

  show(message) {
    this.render(message);
    if (this.dialog) {
      this.dialog.showModal();
    }
    if (this.autoCloseTime) {
      setTimeout(() => this.close(), this.autoCloseTime);
    }
  }

  autoClose(milliseconds) {
    this.autoCloseTime = milliseconds;
    return this;
  }

  close() {
    if (this.dialog) {
      this.dialog.close();
    }
    if (this.autoCloseTime) {
      clearTimeout(this.autoCloseTime);
    }
  }

  bindEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", this.#handleCloseClick);
    }
  }

  unbindEvents() {
    if (this.closeBtn) {
      this.closeBtn.removeEventListener("click", this.#handleCloseClick);
    }
  }

  render(message) {
    renderMessage(this.content, message);
  }
}
