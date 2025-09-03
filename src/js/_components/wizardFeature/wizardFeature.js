/**
 * @file wizardFeature.js
 * Facade for the Wizard feature.
 */

import WizardReporter from "./wizardReporter.js";
import WizardButton from "./wizardButton.js";
import WizardControls from "./wizardControls.js";
import ResetButton from "./resetButton.js";
import WizardModal from "./wizardModal.js";
import wizardStore from "./wizardStore.js";
import { allWizards } from "./allWizards";

function registerElements() {
  if (!customElements.get("wizard-reporter")) {
    customElements.define("wizard-reporter", WizardReporter);
  }
  if (!customElements.get("wizard-button")) {
    customElements.define("wizard-button", WizardButton);
  }
  if (!customElements.get("wizard-controls")) {
    customElements.define("wizard-controls", WizardControls);
  }
  if (!customElements.get("reset-button")) {
    customElements.define("reset-button", ResetButton);
  }
  if (!customElements.get("wizard-modal")) {
    customElements.define("wizard-modal", WizardModal);
  }
}

export default class WizardFeature {
  constructor(rootSelector = "#main") {
    this.rootSelector = rootSelector;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    registerElements();
    this.initialized = true;
    this.modal = document.createElement("wizard-modal");
    this.modal.setAttribute("data-wizard-modal", "true");
    document.body.appendChild(this.modal);

    document.addEventListener(
      "wizards-added",
      this.#handleWizardAdded.bind(this),
    );
  }

  #handleWizardAdded(e) {
    const { item: wizard } = e.detail;
    this.modal.show(`Wizard ${wizard} apologised for arriving late.`);
  }

  destroy() {
    // Remove listeners, clean up DOM, etc.
    this.initialized = false;
  }
}
