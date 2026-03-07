/**
 * @file dateTime.js
 * DateTime utility with strategies
 * for Temporal API and Date() fallback
 */

const DEFAULT_TIMEZONE = "UTC";

const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const timeOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

/**
 * Base strategy interface for date/time operations
 */
class DateTimeStrategy {
  isSupported() {
    throw new Error("Must implement isSupported()");
  }

  getCurrentYear() {
    throw new Error("Must implement getCurrentYear()");
  }

  getTimeZone() {
    throw new Error("Must implement getTimeZone()");
  }

  parseUtcToDate(utcIsoString, timeZone, gmtOffset) {
    throw new Error("Must implement parseUtcToDate()");
  }
}

/**
 * Strategy using Temporal API
 */
class TemporalStrategy extends DateTimeStrategy {
  isSupported() {
    return typeof globalThis.Temporal?.Now?.plainDateISO === "function";
  }

  getCurrentYear() {
    return globalThis.Temporal.Now.plainDateISO().year;
  }

  getTimeZone() {
    try {
      return globalThis.Temporal.Now.zonedDateTimeISO().timeZone || null;
    } catch {
      return null;
    }
  }

  parseUtcToDate(utcIsoString, timeZone) {
    try {
      const utcInstant = globalThis.Temporal.Instant.from(utcIsoString);
      const zoned = utcInstant.toZonedDateTimeISO(timeZone);
      return new Date(zoned.epochMilliseconds);
    } catch {
      return null;
    }
  }
}

/**
 * Strategy using legacy Date API
 */
class DateStrategy extends DateTimeStrategy {
  isSupported() {
    return true; // Always available
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

  getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  }

  parseUtcToDate(utcIsoString, timeZone, gmtOffset) {
    const date = new Date(utcIsoString);

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${utcIsoString}`);
    }

    if (gmtOffset !== undefined) {
      const offsetMilliseconds = gmtOffset * 60 * 60 * 1000;
      return new Date(date.getTime() + offsetMilliseconds);
    }

    return date;
  }
}

class StrategyChooser {
  #strategies = [];

  constructor(strategies) {
    this.#strategies = strategies.filter((s) => s.isSupported());
  }

  getCurrentYear() {
    return this.#strategies[0].getCurrentYear();
  }

  getTimeZone() {
    for (const strategy of this.#strategies) {
      const result = strategy.getTimeZone();
      if (result) return result;
    }
    return DEFAULT_TIMEZONE;
  }

  parseUtcToDate(utcIsoString, timeZone, gmtOffset) {
    for (const strategy of this.#strategies) {
      const result = strategy.parseUtcToDate(utcIsoString, timeZone, gmtOffset);
      if (result) return result;
    }
    throw new Error(`Failed to parse date: ${utcIsoString}`);
  }
}

export default class DateTime {
  #strategy;

  constructor() {
    this.#strategy = new StrategyChooser([
      new TemporalStrategy(),
      new DateStrategy(),
    ]);
  }

  /**
   * Returns the current year as a number.
   */
  getCurrentYear() {
    return this.#strategy.getCurrentYear();
  }

  /**
   * Validates and returns UTC ISO string or throws error.
   * @param {string} utcIsoString
   * @returns {string}
   * @throws {Error}
   */
  #validateUtcIsoString(utcIsoString) {
    if (!utcIsoString || typeof utcIsoString !== "string") {
      throw new Error(`Invalid UTC ISO string: ${utcIsoString}`);
    }
    return utcIsoString;
  }

  /**
   * Formats GMT offset as string
   * @param {number} offset
   * @returns {string}
   */
  #formatGmtOffset(offset) {
    return `GMT${offset >= 0 ? "+" : ""}${offset}`;
  }

  /**
   * @param {string} utcIsoString
   * @returns {string}
   */
  formatRaceStartUserLocal(utcIsoString) {
    try {
      this.#validateUtcIsoString(utcIsoString);
      const userZone = this.#strategy.getTimeZone();
      const date = this.#strategy.parseUtcToDate(utcIsoString, userZone);
      return this.#formatDateTime(date, userZone);
    } catch (err) {
      return utcIsoString;
    }
  }

  /**
   * @param {string} utcIsoString
   * @param {number} gmtOffset
   * @returns {string}
   */
  formatRaceStartLocal(utcIsoString, gmtOffset) {
    try {
      this.#validateUtcIsoString(utcIsoString);

      if (gmtOffset === undefined || gmtOffset === null || isNaN(gmtOffset)) {
        throw new Error(`Invalid GMT offset: ${gmtOffset}`);
      }

      const offsetTimeZone = `UTC${gmtOffset >= 0 ? "+" : ""}${gmtOffset}`;
      const date = this.#strategy.parseUtcToDate(
        utcIsoString,
        offsetTimeZone,
        gmtOffset,
      );
      return this.#formatDateTime(date, this.#formatGmtOffset(gmtOffset));
    } catch (err) {
      return utcIsoString;
    }
  }

  /**
   * Format Date object as string with zone label
   * @param {Date} date
   * @param {string} zoneLabel
   * @returns {string}
   */
  #formatDateTime(date, zoneLabel) {
    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
    return `${formattedDate} at ${formattedTime} (${zoneLabel})`;
  }
}
