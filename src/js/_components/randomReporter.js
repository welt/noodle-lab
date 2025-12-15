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
  renderSkeleton() {
    this.classList.add(...styles);
    this.innerHTML = `
      <h2>Random API Property</h2>
      <h3 class="random-key">Key = <span data-key>Loading…</span></h3>
      <h3 class="random-value">Value = <span data-value></span></h3>
    `;
  }

  /**
   * @param {Object} data - any API response data.
   * Patch only the relevant DOM nodes for performance.
   */
  render(data) {
    this.classList.add(...styles);

    const keyEl = this.querySelector("[data-key]");
    const valueEl = this.querySelector("[data-value]");

    if (!isObject(data)) {
      if (keyEl) keyEl.textContent = "Unavailable";
      if (valueEl) valueEl.textContent = "";
      return;
    }
    const randomProp = randomProperty(data);
    if (!randomProp) {
      if (keyEl) keyEl.textContent = "Not found";
      if (valueEl) valueEl.textContent = "";
      return;
    }
    const [[key, value]] = Object.entries(randomProp);

    if (keyEl) keyEl.textContent = `${key}`;
    if (valueEl) valueEl.textContent = `${getString(value)}`;
  }
}
