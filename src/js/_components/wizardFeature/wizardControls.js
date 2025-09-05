/**
 * @file wizardControls.js
 */
import wizardStore from "./wizardStore.js";
import WizardButton from "./wizardButton.js";
import ControlPanel from "../../_contracts/controlPanel.js";
import eventMixin from "../../_mixins/eventMixin";
import mixinApply from "../../_lib/mixinApply";
import findAndPop from "../../_lib/findAndPop.js";
import { WizardStoreError } from "./errors.js";

const styles = ["wizard-controls"];

export default class WizardControls extends ControlPanel {
  constructor() {
    super();
    this.wizards = wizardStore;
    this.render = this.render.bind(this);
    this.onWizardsUpdated = this.onWizardsUpdated.bind(this);
    this.onWizardAddedToStory = this.onWizardAddedToStory.bind(this);
    this.classList.add(...styles);
  }

  render(data = this.wizards) {
    this.innerHTML = `
      <p>Add a new wizard to the story&hellip;</p>
      <div class="controls-row" role="group" aria-live="polite">
        ${data
          .map(function (wizard) {
            return `<wizard-button class="button">
                      <button>${wizard}</button>
                    </wizard-button>`;
          })
          .join("")}
    </div>`;
  }

  renderError(error) {
    this.classList.add(...styles);
    this.innerHTML = `
      <p>${error.message}</p>
    `;
  }

  connectedCallback() {
    this.render();
    document.addEventListener("wizards", this.onWizardsUpdated);
    this.subscribe("add-wizard-to-story", this.onWizardAddedToStory);
  }

  disconnectedCallback() {
    document.removeEventListener("wizards", this.onWizardsUpdated);
    this.unsubscribe("add-wizard-to-story", this.onWizardAddedToStory);
  }

  onWizardsUpdated(event) {
    this.render(event.detail);
  }

  onWizardAddedToStory(event) {
    try {
      this.updateWizardStore(event);
      this.render(this.wizards);
    } catch (error) {
      this.renderError(error);
    }
  }

  updateWizardStore(event) {
    const removedWizard = findAndPop(this.wizards, event.detail);
    if (this.wizards.length === 0) {
      throw new WizardStoreError("Wizards list is empty.");
    }
    if (!removedWizard) {
      throw new WizardStoreError("Wizard not found in stock.");
    }
  }
}

mixinApply(WizardControls, eventMixin);
