/**
 * @file carbonReporter.js
 * Web component which shows data from
 * the UK Carbon Intensity API.
 */
import Reporter from "../_contracts/reporter.js";
import formatTimestamp from "../_lib/formatTimestamp.js";

const src = "https://api.carbonintensity.org.uk/intensity";
const styles = ["reporter", "reporter--carbon"];

export default class CarbonReporter extends Reporter {
  constructor() {
    super();
    this.src = src;
  }

  renderSkeleton() {
    this.classList.add(...styles, "is-loading");
    this.innerHTML = `
      <h2>UK Carbon Intensity</h2>
      <div class="carbon-content">Loading…</div>
    `;
  }

  /**
   * @param {Object} data - Carbon Intensity API response data.
   * Efficiently patch only the relevant DOM node.
   */
  render(data) {
    this.classList.add(...styles);
    this.classList.remove("is-loading");

    const container = this.querySelector(".carbon-content");
    if (!container) return;

    const [values] = Object.values(data || {});
    if (data === null || !values || values.length === 0) {
      container.textContent = "Unavailable";
      return;
    }

    const firstObject = values[0];
    container.innerHTML = this.generateHtml(firstObject);
  }

  /**
   * Recursively generate HTML definition list(s) from object.
   * @param {Object} obj - Object to generate markup for.
   * @returns {string} - HTML.
   */
  generateHtml(obj) {
    const htmlContent = Object.entries(obj).reduce((html, [key, value]) => {
      if (typeof value === "object" && value !== null) {
        html += `<dt><strong>${key}</strong></dt>`;
        html += `<dd>${this.generateHtml(value)}</dd>`;
      } else {
        html += `<dt>${key}:</dt>`;
        html +=
          key === "from" || key === "to"
            ? `<dd>${formatTimestamp(value)}</dd>`
            : `<dd>${value}</dd>`;
      }
      return html;
    }, "");
    return "<dl>" + htmlContent + "</dl>";
  }
}
