import fetchJson from './fetchJson.js';

export default {
  /**
   * @param {Object} session
   * @returns {Promise<{position:number|null,name:string|null}|null>}
   */
  async findDriver44(session = {}) {
    const sessionKey = session.session_key;
    if (!sessionKey) return null;

    let url = new URL('https://api.openf1.org/v1/session_result');
    url.search = new URLSearchParams({ session_key: sessionKey });

    const resultsRes = await fetchJson(url.toString());
    const results = await resultsRes.json();
    if (!Array.isArray(results) || results.length === 0) return null;

    const result = results.find((r) => Number(r.driver_number) === 44);
    if (!result) return null;

    url = new URL('https://api.openf1.org/v1/drivers');
    url.search = new URLSearchParams({ session_key: sessionKey });
    const driversRes = await fetchJson(url.toString());
    const drivers = await driversRes.json();

    const driversIndexed = new Map((drivers || []).map((d) => [Number(d.driver_number), d]));
    const driver = driversIndexed.get(Number(result.driver_number));
    const name =
      driver?.full_name ??
      (driver ? `${driver.first_name} ${driver.last_name}` : `Driver ${result.driver_number}`);

    return {
      position: Number.isFinite(Number(result.position)) ? Number(result.position) : null,
      name: name ?? null,
      gap_to_leader: result.gap_to_leader ? result.gap_to_leader : null,
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
      return `<div class="driver-44"><p>Error #44 - driver not found.</p></div>`;
    }

    const statusKeys = ['dnf', 'dns', 'dsq'];
    const trueStatuses = statusKeys.filter((k) => Boolean(driverInfo[k]));

    const posOrStatus = trueStatuses.length > 0 ? trueStatuses.join(', ') : (driverInfo.position ?? 'N/A');
    const name = driverInfo.name ?? 'Unknown driver';
    const gapToLeader = driverInfo.gap_to_leader ?? '';

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
