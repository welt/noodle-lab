/**
 * @file wizardFeature.js
 * Facade for the Wizard feature.
 */

import WizardReporter from "./wizardReporter.js";
import WizardButton from "./wizardButton.js";
import WizardControls from "./wizardControls.js";
import ResetButton from "./resetButton.js";

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
}

export default class WizardFeature {
  /**
   * @param {string} rootSelector - CSS selector for the root element.
   */
  constructor(rootSelector = "#main") {
    this.rootSelector = rootSelector;
    this.initialized = false;
  }

  /**
   * Initialize the wizard feature: register elements
   * and perform any setup.
   */
  init() {
    if (this.initialized) return;
    registerElements();
    this.initialized = true;
  }

  /**
   * Clean up the wizard feature if needed.
   */
  destroy() {
    // Remove listeners, clean up DOM, etc.
    this.initialized = false;
  }
}
