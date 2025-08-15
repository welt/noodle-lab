/**
 * @file infoFeature.js
 * Facade for the Info feature.
 * Defines the InfoFeature class.
 * Displays information messages in a plain modal.
 */
import InfoMessage from "./infoMessage.js";
import ensureContract from "../../_mixins/ensureContract.js";
import mixinApply from "../../_lib/mixinApply.js";

export default class InfoFeature {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.modal
   * @param {EventTarget} [options.eventTarget]
   */
  constructor({ modal, eventTarget = document }) {
    this.ensureContract(modal, ["show", "close"]);
    this.modal = modal;
    this.eventTarget = eventTarget;
    this.eventHandler = this.#onShowInfo.bind(this);
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.eventTarget.addEventListener("show-info", this.eventHandler);
    this.initialized = true;
  }

  destroy() {
    if (!this.initialized) return;
    this.eventTarget.removeEventListener("show-info", this.eventHandler);
    this.initialized = false;
  }

  #onShowInfo(e) {
    const text =
      e &&
      e.detail &&
      typeof e.detail.infoText === "string" &&
      e.detail.infoText.length > 0
        ? e.detail.infoText
        : InfoMessage.getText();
    if (this.modal && typeof this.modal.show === "function") {
      this.modal.show(text);
    }
  }
}
mixinApply(InfoFeature, ensureContract);
