/**
 * @file f1WhereIsLewis.js
 * Gets driver #44 information from OpenF1 API.
 */
import fetchJson from "./fetchJson.js";

const LEWIS_DRIVER_NUMBER = 44;
const BASE_URL = "https://api.openf1.org";

/**
 * Builds OpenF1 API URL with session key parameter.
 * @param {string} endpoint - API endpoint path
 * @param {string} sessionKey - Session key
 * @param {Object} additionalParams - Optional additional query parameters
 * @returns {string}
 */
function buildApiUrl(endpoint, sessionKey, additionalParams = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.search = new URLSearchParams({
    session_key: sessionKey,
    ...additionalParams,
  });
  return url.toString();
}

export default {
  /**
   * @param {Object} session
   * @returns {Promise<{position:number|null,name:string|null}|null>}
   */
  async findDriver44(session = {}) {
    const sessionKey = session.session_key;
    if (!sessionKey) return null;

    const sessionResultUrl = buildApiUrl("/v1/session_result", sessionKey);
    const results = await fetchJson(sessionResultUrl);
    if (!Array.isArray(results) || results.length === 0) return null;

    const result = results.find(
      (r) => Number(r.driver_number) === LEWIS_DRIVER_NUMBER,
    );
    if (!result) return null;

    let driver = null;
    try {
      const driversUrl = buildApiUrl("/v1/drivers", sessionKey);
      const drivers = await fetchJson(driversUrl);
      const driversArray = Array.isArray(drivers) ? drivers : [];
      const driversIndexed = new Map(
        driversArray.map((d) => [Number(d.driver_number), d]),
      );

      driver = driversIndexed.get(Number(result.driver_number)) ?? null;
    } catch (err) {
      console.warn(
        "F1WhereIsLewis: failed to fetch driver details, using fallback name",
        err,
      );
    }

    const name =
      driver?.full_name ??
      (driver
        ? `${driver.first_name} ${driver.last_name}`
        : `Driver ${result.driver_number}`);

    return {
      position: Number.isFinite(Number(result.position))
        ? Number(result.position)
        : null,
      name,
      gap_to_leader: result.gap_to_leader ?? null,
      dnf: Boolean(result.dnf),
      dns: Boolean(result.dns),
      dsq: Boolean(result.dsq),
    };
  },

  /**
   * @param {Object} driverInfo object
   * @returns {string}
   */
  getDriver44Html(driverInfo = null) {
    if (!driverInfo) {
      return `<div class="driver-44"><h3>Driver #44</h3><p>No driver #44 data available.</p></div>`;
    }

    const statusKeys = ["dnf", "dns", "dsq"];
    const trueStatuses = statusKeys.filter((key) => Boolean(driverInfo[key]));

    const posOrStatus =
      trueStatuses.length > 0
        ? trueStatuses.join(", ")
        : (driverInfo.position ?? "N/A");
    const name = driverInfo.name ?? "Unknown driver";
    const gapToLeader = driverInfo.gap_to_leader ?? "";

    return `
      <div class="f1-info">
        <h3>How did Lewis do?</h3>
        <ol class="podium__list driver-44">
          <li>
            <span class="podium__position">${posOrStatus}</span>
            <span class="podium__name">${name}</span>
            <span class="podium__number">#44</span>
            <span class="podium__gap_to_leader">${gapToLeader}</span>
          </li>
        </ol>
      </div>`;
  },
};
