/**
 * @file randomReporter.js
 * Web component which shows random properties
 * from any API.
 */
import Reporter from "../_contracts/reporter.js";
import randomProperty from "../_lib/randomProperty.js";

const styles = ["reporter", "reporter--random"];

export default class RandomReporter extends Reporter {
  /**
   * @param {Object} data - any API response data.
   */
  render(data) {
    const { key, value } = randomProperty(data);
    this.classList.add(...styles);
    this.innerHTML = `
      <h2>Key = ${key}</h2>
      <h3>Value = ${value}</h3>
    `;
  }
}
