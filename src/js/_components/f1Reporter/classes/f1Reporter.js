/**
 * @file f1Reporter.js
 * Gets latest meeting details from OpenF1 API.
 */
import Reporter from "../../../_contracts/reporter.js";
import deleteCachesByPrefix from "../../../_lib/deleteCachesByPrefix.js";
import F1WhereIsLewis from "./f1WhereIsLewis.js";
import F1Winners from "./f1Winners.js";
import fetchJson from "./fetchJson.js";
import formatTimestamp from "../../../_lib/formatTimestamp.js";
import mixinApply from "../../../_lib/mixinApply.js";
import textUtils from "../../../_lib/textUtils.js";

const baseUrl = "https://api.openf1.org";
const url = new URL(`${baseUrl}/v1/sessions`);

const params = new URLSearchParams({
  year: "2025",
  meeting_key: "latest",
});

const styles = ["reporter", "reporter--f1"];

class F1Reporter extends Reporter {
  constructor() {
    super();
  }

  renderSkeleton() {
    this.classList.add(...styles, "is-loading");
    this.innerHTML = `
      <h2>Latest F1 Meeting</h2>
      <div class="f1-content">Loading…</div>
    `;
  }

  async render(data) {
    try {
      this.classList.add(...styles);
      this.classList.remove("is-loading");

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
      this.classList.remove("is-loading");
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
    
    await super.connectedCallback();
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

  async #fetchAllPreviousSessions() {
    try {
      return await fetchJson("https://api.openf1.org/v1/sessions");
    } catch (err) {
      console.warn('F1Reporter: failed to fetch previous sessions', err);
      return [];
    }
  }
}

// Apply mixins
mixinApply(F1Reporter, [F1Winners, F1WhereIsLewis, deleteCachesByPrefix]);

export default F1Reporter;
