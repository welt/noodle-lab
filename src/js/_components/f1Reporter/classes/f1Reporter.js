/**
 * @file f1Reporter.js
 * Gets latest meeting details from OpenF1 API.
 */
import Reporter from "../../../_contracts/reporter.js";
import formatTimestamp from "../../../_lib/formatTimestamp.js";
import textUtils from "../../../_lib/textUtils.js";
import fetchJson from "./fetchJson.js";

const baseUrl = "https://api.openf1.org";
const url = new URL(`${baseUrl}/v1/sessions`);

const params = new URLSearchParams({
  year: "2025",
  meeting_key: "latest",
});

const styles = ["reporter", "reporter--f1"];

const SESSION_TYPE = "Race";

export default class F1Reporter extends Reporter {
  /**
   * @param {Array<JSON>} data - OpenF1 API response data.
   */
  async render(data) {
    try {
      this.classList.add(...styles);

      // Try latest meeting first, then search all meetings
      let session = this.#lastSession(Array.isArray(data) ? data : []);
      
      if (!session) {
        const allSessions = await this.#fetchAllPreviousSessions();
        session = this.#lastSession(allSessions);
      }

      if (!session) {
        this.innerHTML = `
          <h2>Latest F1 Meeting</h2>
          <p>No session data available.</p>
        `;
        return;
      }

      const podium = await this.getWinners(session);
      const lewisInfo = await this.findDriver44(session);

      this.innerHTML = `
        <div class="f1-reporter__meeting-details">
          <!-- data from OpenF1 https://openf1.org/ -->
          <h2>Latest F1 Result: <span class="f1-reporter__session-type">${session.session_type}</span></h2>
          <dl>
            <dt>Meeting Name:</dt>
            <dd>${session.country_name}, ${session.location}</dd>
            <dt>Circuit Name:</dt>
            <dd><em>${textUtils.toTitleCase(session.circuit_short_name)}</em></dd>
            <dt>Meeting Date:</dt>
            <dd>${formatTimestamp(session.date_start)}</dd>
          </dl>
        </div>
      `;

      this.innerHTML += this.getPodiumHtml(Array.isArray(podium) ? podium : []);
      this.innerHTML += this.getDriver44Html(lewisInfo);
    } catch (err) {
      this.classList.add(...styles);
      this.innerHTML = `
        <h2>Latest F1 Meeting</h2>
        <p>No session data.</p>
      `;
    }
  }

  async emptyCaches() {
    try {
      await this.deleteCachesByPrefix(baseUrl);
    } catch (err) {
      console.error('F1Reporter: failed to empty caches', err);
    }
  }

  async connectedCallback() {
    url.search = params;
    this.src = url;
    try {
      await super.connectedCallback();
    } catch (err) {
      console.error('F1Reporter: failed to load initial data', err);
      this.classList.add(...styles);
      this.innerHTML = `
      <h2>Latest F1 Results</h2>
      <p>No session data.</p>
      `;
    }
  }

  #lastSession(results) {
    if (!Array.isArray(results) || results.length === 0) {
      return null;
    }
    
    return results.reduce((latest, current) => {
      const currentTime = new Date(current.date_start).getTime();
      const latestTime = new Date(latest.date_start).getTime();
      return currentTime > latestTime ? current : latest;
    });
  }

  /**
   * Fetch sessions from previous meetings for a completed race
   * @param {Object} currentData - Current failed data
   * @returns {Promise<Array>}
   */
  async #fetchAllPreviousSessions() {
    try {
      return await fetchJson("https://api.openf1.org/v1/sessions");
    } catch (err) {
      console.warn('F1Reporter: failed to fetch previous sessions', err);
      return [];
    }
  }
}
