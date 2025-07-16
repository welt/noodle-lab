/**
 * @file wizardReporter.js
 */
import Reporter from "../_contracts/reporter.js";

const styles = ["reporter", "reporter--wizard"];

export default class WizardReporter extends Reporter {
  constructor() {
    super();
  }

  render(data) {
    console.log('>>>>> IN RENDER...', data);
    this.classList.add(...styles);
    this.innerHTML = `
      <p><code>Wizards</code> from the API:</p>
      <ul>
        ${data.map(function (wizard) {
          return `<li>${wizard}</li>`;
        }).join('')}
      </ul>`;
  }

  connectedCallback() {
    console.log('>>>>> IN CB...', this);
    this.addEventListener('wizards', (event) => {
      console.log('>>>>> IN CB...', event.detail);
      this.render(event.detail);
    });
    this.render({});
  }
}
