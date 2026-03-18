/**
 * F1Reporter: Displays latest F1 meeting details
 * from OpenF1 API.
 */
import Reporter from "../../../_contracts/reporter.js";
import deleteCachesByPrefix from "../../../_lib/deleteCachesByPrefix.js";
import f1Winners from "./f1Winners.js";
import f1WhereIsLewis from "./f1WhereIsLewis.js";
import fetchJson from "./fetchJson.js";
import textUtils from "../../../_lib/textUtils.js";
import DateTime from "../../../_lib/dateTime.js";

const BASE_URL = "https://api.openf1.org";
const STYLES = ["reporter", "reporter--f1"];

class F1Reporter extends Reporter {
  #winnersService;
  #driverService;
  #cacheService;
  #dateTime;

  /**
   * @param {Object} options - Dependencies
   * @param {Object} options.winnersService - Service for fetching winners
   * @param {Object} options.driverService - Service for fetching driver info
   * @param {Object} options.cacheService - Service for cache management
   * @param {Object} options.dateTime - DateTime utility
   */
  constructor({
    winnersService = f1Winners,
    driverService = f1WhereIsLewis,
    cacheService = { deleteCachesByPrefix },
    dateTime = new DateTime(),
  } = {}) {
    super();
    this.#winnersService = winnersService;
    this.#driverService = driverService;
    this.#cacheService = cacheService;
    this.#dateTime = dateTime;
  }

  /**
   * Renders skeleton/loading state.
   */
  renderSkeleton() {
    this.classList.add(...STYLES, "is-loading");
    this.innerHTML = this.#getSkeletonHtml();
  }

  /**
   * Main render method. Handles all rendering logic and error states.
   * @param {Array|Object} data - Session data from OpenF1 API.
   */
  async render(data) {
    this.#applyStyles();

    try {
      const session = await this.#resolveSession(data);

      if (!session) {
        this.#renderError("No session data available.");
        return;
      }

      const podium = await this.#fetchWinnersSafe(session);
      const lewisInfo = await this.#fetchDriver44Safe(session);

      this.innerHTML = this.#buildFullHtml(session, podium, lewisInfo);
    } catch (err) {
      console.error("F1Reporter: render failed", err);
      this.#renderError("An error occurred while loading session data.");
    }
  }

  /**
   * Empties caches for OpenF1 API.
   */
  async emptyCaches() {
    try {
      await this.#cacheService.deleteCachesByPrefix(BASE_URL);
    } catch (err) {
      console.error("F1Reporter: failed to empty caches", err);
    }
  }

  /**
   * Sets up Reporter element.
   */
  async connectedCallback() {
    this.src = this.#buildSessionUrl();
    await super.connectedCallback();
  }

  #buildSessionUrl() {
    const url = new URL(`${BASE_URL}/v1/sessions`);
    url.search = new URLSearchParams({
      year: this.#dateTime.getCurrentYear(),
      meeting_key: "latest",
      session_type: "Race",
    });
    return url;
  }

  /**
   * Resolves latest session from provided data
   * or fetches all sessions.
   * @param {Array|Object} data
   * @returns {Promise<Object|null>}
   */
  async #resolveSession(data) {
    const sessions = Array.isArray(data) ? data : [];
    let session = this.#findLatestSession(sessions);

    if (!session) {
      const allSessions = await this.#fetchAllSessions();
      session = this.#findLatestSession(allSessions);
    }

    return session;
  }

  /**
   * Finds latest Race session from an array of results.
   * @param {Array} sessions
   * @returns {Object|null}
   */
  #findLatestSession(sessions) {
    if (!Array.isArray(sessions) || sessions.length === 0) {
      return null;
    }

    const raceSessions = sessions.filter((s) => s.session_type === "Race");

    if (raceSessions.length === 0) {
      return null;
    }

    return raceSessions.reduce((latest, current) => {
      const currentTime = new Date(current.date_start).getTime();
      const latestTime = new Date(latest.date_start).getTime();
      return currentTime > latestTime ? current : latest;
    });
  }

  /**
   * Fetches all sessions from OpenF1 API.
   * @returns {Promise<Array>}
   */
  async #fetchAllSessions() {
    try {
      return await fetchJson(`${BASE_URL}/v1/sessions`);
    } catch (err) {
      console.warn("F1Reporter: failed to fetch sessions", err);
      return [];
    }
  }

  /**
   * Generic safe fetch wrapper with error handling.
   * @param {Function} fetchFn - Async function to execute
   * @param {string} errorContext - Context for error logging
   * @param {*} fallbackValue - Value to return on error
   * @returns {Promise<*>}
   */
  async #safelyFetch(fetchFn, errorContext, fallbackValue) {
    try {
      return await fetchFn();
    } catch (err) {
      console.error(`F1Reporter: ${errorContext}`, err);
      return fallbackValue;
    }
  }

  /**
   * Safely fetches winners, returns empty array on error.
   * @param {Object} session
   * @returns {Promise<Array>}
   */
  async #fetchWinnersSafe(session) {
    return this.#safelyFetch(
      () => this.#winnersService.getWinners(session),
      "failed to get winners",
      [],
    );
  }

  /**
   * Safely fetches driver 44 info, returns null on error.
   * @param {Object} session
   * @returns {Promise<Object|null>}
   */
  async #fetchDriver44Safe(session) {
    return this.#safelyFetch(
      () => this.#driverService.findDriver44(session),
      "failed to find driver 44",
      null,
    );
  }

  #applyStyles() {
    this.classList.add(...STYLES);
    this.classList.remove("is-loading");
  }

  /**
   * Builds complete HTML output.
   * @param {Object} session
   * @param {Array} podium
   * @param {Object|null} lewisInfo
   * @returns {string}
   */
  #buildFullHtml(session, podium, lewisInfo) {
    const podiumArray = Array.isArray(podium) ? podium : [];
    return [
      this.#getMeetingDetailsHtml(session),
      this.#winnersService.getPodiumHtml(podiumArray),
      this.#driverService.getDriver44Html(lewisInfo),
    ].join("");
  }

  /**
   * Returns skeleton/loading HTML.
   * @returns {string}
   */
  #getSkeletonHtml() {
    return `
      <h2>Latest F1 Meeting</h2>
      <div class="f1-content">Loading…</div>
    `;
  }

  /**
   * Renders an error or empty state.
   * @param {string} message
   */
  #renderError(message) {
    this.innerHTML = this.#getSkeletonHtml().replace(
      "Loading…",
      `<p>${message}</p>`,
    );
  }

  /**
   * Renders meeting details HTML.
   * @param {Object} session
   * @returns {string}
   */
  #getMeetingDetailsHtml(session) {
    const startTime = session.date_start || session.start_time;
    const gmtOffset = this.#parseGmtOffset(session.gmt_offset);

    const raceLocal = this.#dateTime.formatRaceStartLocal(startTime, gmtOffset);
    const userLocal = this.#dateTime.formatRaceStartUserLocal(startTime);

    const div = document.createElement("div");
    div.className = "f1-reporter__meeting-details";

    const h2 = document.createElement("h2");
    h2.innerHTML =
      'Latest F1 Result: <span class="f1-reporter__session-type"></span>';
    h2.querySelector("span").textContent = session.session_type ?? "";

    const dl = this.#buildDefinitionList([
      {
        label: "Meeting Name:",
        value: `${session.country_name ?? ""}, ${session.location ?? ""}`,
      },
      {
        label: "Circuit Name:",
        value: textUtils.toTitleCase(session.circuit_short_name ?? ""),
        emphasized: true,
      },
      {
        label: "Meeting Date:",
        value: this.#buildDateWithDetails(raceLocal, userLocal, startTime),
        isHtml: true,
      },
    ]);

    div.appendChild(h2);
    div.appendChild(dl);

    return div.outerHTML;
  }

  /**
   * Builds date display with details/summary for local time.
   * @param {string} raceLocal - Race local time string
   * @param {string} userLocal - User local time string
   * @param {string} startTime - ISO datetime for time element
   * @returns {string}
   */
  #buildDateWithDetails(raceLocal, userLocal, startTime) {
    const time = document.createElement("time");
    time.setAttribute("datetime", startTime);
    time.textContent = raceLocal;

    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = "Show your local time";

    const localTime = document.createElement("time");
    localTime.setAttribute("datetime", startTime);
    localTime.textContent = userLocal;

    details.appendChild(summary);
    details.appendChild(localTime);

    const wrapper = document.createElement("div");
    wrapper.appendChild(time);
    wrapper.appendChild(details);

    return wrapper.innerHTML;
  }

  /**
   * Builds a definition list from items.
   * @param {Array<{label: string, value: string, emphasized?: boolean, isHtml?: boolean}>} items
   * @returns {HTMLDListElement}
   */
  #buildDefinitionList(items) {
    const dl = document.createElement("dl");

    items.forEach(({ label, value, emphasized, isHtml }) => {
      const dt = document.createElement("dt");
      dt.textContent = label;

      const dd = document.createElement("dd");
      if (isHtml) {
        dd.innerHTML = value;
      } else if (emphasized) {
        const em = document.createElement("em");
        em.textContent = value;
        dd.appendChild(em);
      } else {
        dd.textContent = value;
      }

      dl.appendChild(dt);
      dl.appendChild(dd);
    });

    return dl;
  }

  /**
   * Parses GMT offset from string or number.
   * @param {string|number} offset
   * @returns {number}
   */
  #parseGmtOffset(offset) {
    return typeof offset === "string" ? parseFloat(offset) : offset;
  }
}

export default F1Reporter;
