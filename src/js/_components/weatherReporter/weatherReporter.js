/**
 * @file weatherReporter.js
 * Stub WeatherReporter web component.
 * Fulfills the reporter contract.
 */
import Reporter from "../../_contracts/reporter.js";
import formatError from "./formatError.js";
import formatDisplayValues from "./formatDisplayValues.js";

export default class WeatherReporter extends Reporter {
  constructor() {
    super();
    this.strategy = null;
    this.data = null;
    this.error = null;
  }

  async connectedCallback() {
    this.classList.add(
      "reporter",
      "reporter--weather",
      "grid-item",
      "inline-list",
    );
  }

  async setStrategy(strategy) {
    this.strategy = strategy;
    await this.fetchAndRender();
  }

  async fetchAndRender() {
    this.innerHTML = `<h2>Weather report for your area</h2>
      <loading-spinner></loading-spinner>
      <p>Loading...</p>`;

    if (!this.strategy) {
      this.innerHTML = `<h2>Weather report for your area</h2><p>No strategy set.</p>`;
      return;
    }
    try {
      this.data = await this.strategy.getWeatherData();
      this.error = null;
    } catch (err) {
      this.data = null;
      this.error = err;
    }

    this.render();
  }

  render() {
    if (this.error) {
      this.innerHTML = `<h2>Weather report for your area</h2>
        <p>${formatError(this.error)}</p>`;
      return;
    }
    if (!this.data) {
      this.innerHTML = `<h2>Weather report for your area</h2>
        <loading-spinner></loading-spinner>
        <p>Loading...</p>`;
      return;
    }

    const {
      cityDisplay,
      latDisplay,
      lonDisplay,
      tempDisplay,
      conditionDisplay,
    } = formatDisplayValues(this.data);

    this.innerHTML = `
       <h2>Local Weather</h2>
       <dl>
        <dt><strong>Location:</strong></dt><dd>${cityDisplay} (${latDisplay},&#8288;${lonDisplay})</dd>
        <dt><strong>Temperature:</strong></dt><dd>${tempDisplay}</dd>
        <dt><strong>Conditions:</strong></dt><dd>${conditionDisplay}</dd>
       </dl>
     `;
  }
}
