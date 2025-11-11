/**
 * @file f1Reporter.js
 * Gets latest meeting details from OpenF1 API.
 */
import Reporter from "../_contracts/reporter.js";
import formatTimestamp from "../_lib/formatTimestamp.js";
import textUtils from "../_lib/textUtils.js";

const now = new Date();
const fullYear = now.toISOString().slice(0, 10);
const url = new URL("https://api.openf1.org/v1/sessions");

const params = new URLSearchParams({
  year: "2025",
  session_name: "Race",
  "date_end<": fullYear,
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
    const past = data.filter(
      (session) => session.date_end && new Date(session.date_end) <= now,
    );

    if (past.length === 0)
      throw new Error("No completed races found yet this year.");

    const last = past.reduce((a, b) =>
      new Date(a.date_end) > new Date(b.date_end) ? a : b,
    );

    this.classList.add(...styles);
    this.innerHTML = `
      <h2>Latest F1 Meeting</h2>
      <dl>
        <dt>Location:</dt>
        <dd>${last.country_name}, ${last.location}</dd>
        <dt>Circuit:</dt>
        <dd><em>${textUtils.toTitleCase(last.circuit_short_name)}</em></dd>
        <dt>Meeting Date:</dt>
        <dd>${formatTimestamp(last.date_start)}</dd>
      </dl>
    `;
  }
  async connectedCallback() {
    url.search = params;
    this.src = url;
    await super.connectedCallback();
  }
}
