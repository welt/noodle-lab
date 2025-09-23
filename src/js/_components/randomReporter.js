/**
 * @file randomReporter.js
 * Web component which shows random properties
 * from any API.
 */
import isObject from "../_lib/isObject.js";
import randomProperty from "../_lib/randomProperty.js";
import Reporter from "../_contracts/reporter.js";

const styles = ["reporter", "reporter--random"];

/**
 * Recursively look for the first string value in an object.
 * @param {Object} data
 * @returns {String}
 */
const getString = (data) => {
  if (!isObject(data)) return data;
  const [firstKey, firstValue] = Object.entries(data)[0] || [];
  if (!firstKey) return "";
  let content = "";
  if (typeof firstValue === "object" && firstValue !== null) {
    content += getString(firstValue);
  } else {
    content += firstValue;
  }
  return content;
};

export default class RandomReporter extends Reporter {
  /**
   * @param {Object} data - any API response data.
   */
  render(data) {
    if (!isObject(data)) {
      console.error("Invalid data provided to RandomReporter");
      return;
    }
    const randomProp = randomProperty(data);
    if (!randomProp) {
      console.error("No properties found in the API data");
      return;
    }
    const [[key, value]] = Object.entries(randomProp);
    this.classList.add(...styles);
    this.innerHTML = `
      <h2>Random API Property</h2>
      <h3>Key = ${key}</h3>
      <h3>Value = ${getString(value)}</h3>
    `;
  }
}
