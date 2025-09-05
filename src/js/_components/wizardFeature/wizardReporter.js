/**
 * @file wizardReporter.js
 */
import Reporter from "../../_contracts/reporter.js";
import wizardStore from "./wizardStore.js";
import { WizardStoreError } from "./errors.js";

const styles = ["reporter", "reporter--wizard", "list-inline"];

const INITIAL_NUMBER_OF_WIZARDS = 3;

export default class WizardReporter extends Reporter {
  #localWizards;

  constructor() {
    super();
    this.#initLocalWizards();
    this.onResetWizardStory = this.#onResetWizardStory.bind(this);
    this.onAddWizardToStory = this.#onAddWizardToStory.bind(this);
  }

  #initLocalWizards() {
    try {
      this.#localWizards = wizardStore.splice(0, INITIAL_NUMBER_OF_WIZARDS);
      if (
        !Array.isArray(this.#localWizards) ||
        this.#localWizards.length !== INITIAL_NUMBER_OF_WIZARDS
      ) {
        throw new WizardStoreError("Error initialising local wizard store.");
      }
    } catch (error) {
      this.#renderError(error);
    }
  }

  #render(data = this.#localWizards) {
    const isDisabled = this.#localWizards.length === 0;
    this.classList.add(...styles);
    this.innerHTML = `
      <h2>Wizards in this story:</h2>
      <ul aria-live="polite">
        ${data
          .map(function (wizard) {
            return `<li>${wizard}</li>`;
          })
          .join("")}
      </ul>
      <reset-button>
      <button
        ${isDisabled ? "disabled aria-disabled='true' title='No wizards to remove'" : ""}
      >
        Reset Story
      </button>
      </reset-button>`;
  }

  #renderError(error) {
    this.innerHTML = `
      <div class="error">
        <h4>${error.name}</h4>
        <p>${error.message}</p>
      </div>`;
  }

  connectedCallback() {
    this.#render();
    this.#bindEvents();
  }

  disconnectedCallback() {
    this.#unbindEvents();
  }

  logMessage(message) {
    console.log(`Fetched: received new DATA:wizard> ${message}`);
  }

  #onAddWizardToStory(event) {
    const { detail } = event;
    this.logMessage(detail);
    this.#localWizards.push(detail);
    this.#render();
  }

  #onResetWizardStory() {
    this.logMessage("Resetting wizard story");
    const mergedWizards = [...wizardStore, ...this.#localWizards];
    // Using splice to avoid creating any push events for a reset.
    wizardStore.splice(0, wizardStore.length, ...mergedWizards);
    this.#localWizards = [];
    this.#render();
  }

  #bindEvents() {
    document.addEventListener("add-wizard-to-story", this.onAddWizardToStory);
    document.addEventListener("reset-wizard-story", this.onResetWizardStory);
  }

  #unbindEvents() {
    document.removeEventListener(
      "add-wizard-to-story",
      this.onAddWizardToStory,
    );
    document.removeEventListener("reset-wizard-story", this.onResetWizardStory);
  }
}
