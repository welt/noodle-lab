/**
 * @file wizardReporter.js
 */
import Reporter from "../../_contracts/reporter.js";
import wizardStore from "./wizardStore.js";

const styles = ["reporter", "reporter--wizard", "list-inline"];

export default class WizardReporter extends Reporter {
  #localWizards;

  constructor() {
    super();
    // Initialize private local wizards with three from the global store.
    const initialWizards = 3;
    try {
      this.#localWizards = wizardStore.splice(0, initialWizards);
      if (
        !Array.isArray(this.#localWizards) ||
        this.#localWizards.length !== initialWizards
      ) {
        throw new Error("Error initialising local wizard store.");
      }
    } catch (error) {
      this.innerHTML = `
        <div class="error">
          <p>${error.message}</p>
        </div>`;
    }
  }

  render(data = this.#localWizards) {
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

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  logMessage(message) {
    console.log(`Fetched: received new DATA:wizard> ${message}`);
  }

  bindEvents() {
    document.addEventListener("add-wizard-to-story", (event) => {
      const { detail } = event;
      this.logMessage(detail);
      this.#localWizards.push(detail);
      this.render();
    });

    document.addEventListener("reset-wizard-story", () => {
      this.logMessage("Resetting wizard story");
      const mergedWizards = [...wizardStore, ...this.#localWizards];
      // Using splice to avoid creating any push events for a reset.
      wizardStore.splice(0, wizardStore.length, ...mergedWizards);
      this.#localWizards = [];
      this.render();
    });
  }
}
