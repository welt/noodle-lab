/**
 * @file f1Reporter.js
 * Gets latest meeting details from OpenF1 API.
 */
import Reporter from "../../../_contracts/reporter.js";
import formatTimestamp from "../../../_lib/formatTimestamp.js";
import textUtils from "../../../_lib/textUtils.js";

const url = new URL("https://api.openf1.org/v1/sessions");

const params = new URLSearchParams({
  year: "2025",
  meeting_key: "latest",
  session_type: "Race",
  "date_end<": new Date().toISOString().split("T")[0],
});

const styles = ["reporter", "reporter--f1"];

export default class F1Reporter extends Reporter {
  constructor() {
    super();
  }

  /**
   * @param {Array<JSON>} data - OpenF1 API response data.
   */
  async render(data) {
    const oData = this.#lastRaceSession(Array.isArray(data) ? data : []);
    const podium = await this.getWinners(oData);
    const lewisInfo = await this.findDriver44(oData);

    this.classList.add(...styles);

    if (!oData) {
      this.innerHTML = `
        <h2>Latest F1 Meeting</h2>
        <p>No session data available.</p>
      `;
      return;
    }

    this.innerHTML = `
      <div class="f1-reporter__meeting-details">
        <h2>Latest F1 Meeting</h2>
        <dl>
          <dt>Meeting Name:</dt>
          <dd>${oData.country_name}, ${oData.location}</dd>
          <dt>Circuit Name:</dt>
          <dd><em>${textUtils.toTitleCase(oData.circuit_short_name)}</em></dd>
          <dt>Meeting Date:</dt>
          <dd>${formatTimestamp(oData.date_start)}</dd>
        </dl>
      </div>
    `;

    this.innerHTML += this.getPodiumHtml(Array.isArray(podium) ? podium : []);
    this.innerHTML += this.getDriver44Html(lewisInfo);
  }

  async connectedCallback() {
    url.search = params;
    this.src = url;
    await super.connectedCallback();
  }

  /**
   * @param {Array<Object>} sessions
   * @returns {Object|null}
   */
  #lastRaceSession(sessions = []) {
    return [...sessions].reduce((a, b) =>
      new Date(a.date_end) > new Date(b.date_end) ? a : b
    );
  }
}
