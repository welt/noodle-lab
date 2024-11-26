/**
 * @file carbonReporter.js
 * Web component which shows data from
 * the UK Carbon Intensity API.
 */
import Reporter from "../_contracts/reporter.js";

const src = "https://api.carbonintensity.org.uk/intensity";
const styles = ["reporter", "reporter--carbon"];

export default class CarbonReporter extends Reporter {
  constructor() {
    super();
    this.src = src;
  }

  /**
   * @param {Object} data - Carbon Intensity API response data.
   */
  render(data) {
    const [values] = Object.values(data);
    let htmlContent = "";

    if (values.length > 0) {
      const firstObject = values[0];
      htmlContent = this.generateHtml(firstObject);
    }

    this.classList.add(...styles);
    this.innerHTML = htmlContent;
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
        html += `<dd>${value}</dd>`;
      }
      return html;
    }, "");
    return "<dl>" + htmlContent + "</dl>";
  }
}
