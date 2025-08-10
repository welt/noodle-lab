/**
 * @file wizardControls.js
 */
import wizardStore from "./wizardStore.js";
import WizardButton from "./wizardButton.js";
import ControlPanel from "../../_contracts/controlPanel.js";
import eventMixin from "../../_mixins/eventMixin";
import mixinApply from "../../_lib/mixinApply";
import findAndPop from "../../_lib/findAndPop.js";

customElements.define("wizard-button", WizardButton);

const styles = ["controls", "controls--wizard"];

export default class WizardControls extends ControlPanel {
  constructor() {
    super();
    this.wizards = wizardStore;
    this.render = this.render.bind(this);
    this.onWizardsUpdated = this.onWizardsUpdated.bind(this);
    this.onWizardAddedToStory = this.onWizardAddedToStory.bind(this);
  }

  render(data = this.wizards) {
    this.classList.add(...styles);
    this.innerHTML = `
      <div>
        <p>Add a new wizard to the story&hellip;</p>
          ${data
            .map(function (wizard) {
              return `<wizard-button class="button">
                        <button>${wizard}</button>
                      </wizard-button>`;
            })
            .join("")}
      </div>`;
  }

  connectedCallback() {
    this.render();
    document.addEventListener("wizards", this.onWizardsUpdated);
    this.subscribe("add-wizard-to-story", this.onWizardAddedToStory);
  }

  onWizardsUpdated(event) {
    this.render(event.detail);
  }

  onWizardAddedToStory(event) {
    try {
      const removedWizard = findAndPop(this.wizards, event.detail);
      if (this.wizards.length === 0) {
        throw new Error("Wizards list is empty.");
      }
      if (!removedWizard) {
        throw new Error("Wizard not found in stock.");
      }
      this.render(this.wizards);
    } catch (error) {
      this.innerHTML = `
        <div class="error">
          <p>${error.message}</p>
        </div>`;
    }
  }
}

mixinApply(WizardControls, eventMixin);
