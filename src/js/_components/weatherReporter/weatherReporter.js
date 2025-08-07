/**
 * @file weatherReporter.js
 * Stub WeatherReporter web component.
 * Fulfills the reporter contract.
 */
import Reporter from "../../_contracts/reporter.js";

const src = "https://api.github.com/repos/11ty/eleventy"; // !! dummy placeholder src
const styles = ["reporter", "reporter--weather", "grid-item"];

export default class WeatherReporter extends Reporter {
  constructor() {
    super();
    this.src = src;
  }

  render() {
    this.classList.add(...styles);
    this.innerHTML = `
      <h2>Weather report for your area</h2>
    `;
  }
}
customElements.define("weather-reporter", WeatherReporter);
