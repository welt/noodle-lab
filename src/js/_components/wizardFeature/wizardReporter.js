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

  render(data) {
    // Use provided data or fall back to local wizards
    const wizardData = data !== undefined ? data : this.#localWizards;
    
    this.classList.add(...styles);
    
    // Handle empty state
    if (!wizardData || !Array.isArray(wizardData) || wizardData.length === 0) {
      this.innerHTML = `
        <h2>Wizards in this story:</h2>
        <div class="empty-state" role="status" aria-live="polite">
          <p>No wizards have been added to this story yet.</p>
          <p>Use the controls above to add wizards to your story.</p>
        </div>`;
      return;
    }
    
    this.innerHTML = `
      <h2>Wizards in this story:</h2>
      <ul role="list" aria-label="List of wizards in the story">
        ${wizardData
          .map(function (wizard) {
            return `<li role="listitem">${wizard}</li>`;
          })
          .join("")}
      </ul>`;
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
  }
}
