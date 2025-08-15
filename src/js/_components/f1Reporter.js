/**
 * @file f1Reporter.js
 * Gets latest meeting details from OpenF1 API.
 */
import Reporter from "../_contracts/reporter.js";
import formatTimestamp from "../_lib/formatTimestamp.js";
import textUtils from "../_lib/textUtils.js";

const url = new URL("https://api.openf1.org/v1/meetings");
const params = new URLSearchParams({
  year: "2025",
  meeting_key: "latest",
});

const styles = ["reporter", "reporter--f1"];

export default class F1Reporter extends Reporter {
  constructor() {
    super();
  }

  /**
   * @param {Array<JSON>} data - OpenF1 API response data.
   */
  render(data) {
    const [oData] = data;
    this.classList.add(...styles);
    this.innerHTML = `
      <h2>Latest F1 Meeting</h2>
      <dl>
        <dt>Meeting Name:</dt>
        <dd>${oData.meeting_name}</dd>
        <dt>Meeting Official Name:</dt>
        <dd><em>${textUtils.toTitleCase(oData.meeting_official_name)}</em></dd>
        <dt>Meeting Date:</dt>
        <dd>${formatTimestamp(oData.date_start)}</dd>
      </dl>
    `;
  }
  async connectedCallback() {
    url.search = params;
    this.src = url;
    await super.connectedCallback();
  }
}
