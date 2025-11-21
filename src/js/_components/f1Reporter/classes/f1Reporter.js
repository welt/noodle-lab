/**
 * @file f1Reporter.js
 * Gets latest meeting details from OpenF1 API.
 */
import Reporter from "../../../_contracts/reporter.js";
import formatTimestamp from "../../../_lib/formatTimestamp.js";
import textUtils from "../../../_lib/textUtils.js";
import fetchJson from "./fetchJson.js";

const url = new URL("https://api.openf1.org/v1/sessions");

const params = new URLSearchParams({
  year: "2025",
  meeting_key: "latest",
  //"date_end<": new Date().toISOString().split("T")[0],
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
    let oData = this.#lastRaceSession(Array.isArray(data) ? data : []);

    // If no race in latest meeting, search previous meetings
    if (!oData) {
      const allSessions = await this.#fetchPreviousMeetingSessions();
      oData = this.#lastRaceSession(allSessions);
    }

    if (!oData) {
      this.classList.add(...styles);
      this.innerHTML = `
      <h2>Latest F1 Meeting</h2>
      <p>No session data available.</p>
      `;
      return;
    }
    
    const podium = await this.getWinners(oData);
    const lewisInfo = await this.findDriver44(oData);

    this.classList.add(...styles);

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
  #lastRaceSession(results) {
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const raceSessions = results
    .filter(session => session.session_type === "Race")
    .sort((a, b) => {
      const aTime = new Date(a.date_start).getTime();
      const bTime = new Date(b.date_start).getTime();
      return bTime - aTime;
    });

  return raceSessions.length > 0 ? raceSessions[0] : null;
}

/**
 * Fetch sessions from previous meetings for a completed race
 * @param {Object} currentData - Current failed data
 * @returns {Promise<Array>}
 */
  async #fetchPreviousMeetingSessions() {
    const prevParams = new URLSearchParams({
      year: "2025",
    });

    const prevUrl = new URL("https://api.openf1.org/v1/sessions");
    prevUrl.search = prevParams;

    try {
      return await fetchJson(prevUrl.toString());
    } catch (err) {
      console.warn('F1Reporter: failed to fetch previous sessions', err);
      return [];
    }
  }
}
