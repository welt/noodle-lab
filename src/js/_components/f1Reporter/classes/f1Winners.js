import { F1ReporterError } from './errors';
import fetchJson from './fetchJson.js';

export default {
  /**
   * @param {Object} session
   * @returns {Promise<Array<Object>>}
  */
  async getWinners(session = {}) {
    let url;

    const sessionKey = session.session_key;

    url = new URL('https://api.openf1.org/v1/session_result');
    url.search = new URLSearchParams({
      session_key: sessionKey,
      "position<": "3",
    });

    const resultsRes = await fetchJson(url.toString());
    const results = await resultsRes.json();

    if (!Array.isArray(results) || results.length === 0) {
      throw new F1ReporterError(
        "No results found for the latest race.",
      );
    }

    results.sort((a, b) => a.position - b.position);

    url = new URL('https://api.openf1.org/v1/drivers');
    url.search = new URLSearchParams({
      session_key: sessionKey,
    });

    const driversRes = await fetchJson(url.toString());
    const drivers = await driversRes.json();

    const driversIndexed = new Map(drivers.map((driver) => [driver.driver_number, driver]));

    const podium = results.map((result) => {
      const driver = driversIndexed.get(result.driver_number);
      const name =
        driver?.full_name ??
        (driver ? `${driver.first_name} ${driver.last_name}` : `Driver ${result.driver_number}`);
      return {
        position: result.position,
        driver_number: result.driver_number,
        name,
        gap_to_leader: result.gap_to_leader,
      };
    });

    return podium;
  },
  /**
   * @param {Array<Object>} podium
   * @returns {string} HTML for the podium list
   */
  getPodiumHtml(podium = []) {
    if (!Array.isArray(podium) || podium.length === 0) {
      return `<section class="podium"><h3>Podium</h3><p>No podium data available.</p></section>`;
    }

    const winners = podium
      .sort((a, b) => a.position - b.position)
      .map((driver) => {
        const pos = Number.isFinite(driver.position) ? driver.position : '';
        const number = driver.driver_number ? `#${driver.driver_number}` : '';
        const name = driver.name ?? 'Unknown driver';
        const gapToLeader = driver.gap_to_leader ? driver.gap_to_leader : '';
        return `<li class="podium__item podium__pos--${pos}">
          <span class="podium__position">${pos}</span>
          <span class="podium__name">${name}</span>
          <span class="podium__number">${number}</span>
          <span class="podium__gap_to_leader">${gapToLeader}</span>
        </li>`;
      })
      .join('');

    return `<div class="f1-info podium">
      <h3>Podium</h3>
      <ol class="podium__list">
        ${winners}
      </ol>
    </div>`;
  }
};
