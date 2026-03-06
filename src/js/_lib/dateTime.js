/**
 * @file dateTime.js
 * Use Temporal API if available, otherwise use Date object.
 */

export class DateTime {
  #getYear;

  constructor() {
    this.#getYear =
      typeof globalThis.Temporal?.Now?.plainDateISO === "function"
        ? () => globalThis.Temporal.Now.plainDateISO().year
        : () => new Date().getFullYear();
  }

  getCurrentYear() {
    return this.#getYear();
  }
}
