/**
 * @file scripts/dateFilter.js
 * 11ty date filter function.
 */

/**
 * Formats date for RSS feed.
 * @param {string|Date} value - Date string or Date object
 * @param {string} format
 * @returns {string}
 */
const formatsAllowed = {
  utc: (date) => date.toUTCString(),
  iso: (date) => date.toISOString(),
};

export default function dateFilter(value, format = "utc") {
  const dateObj = value === "now" ? new Date() : new Date(value);

  const formatter = formatsAllowed[format];

  if (!formatter) {
    throw new Error(
      `Unsupported date format: "${format}". Allowed formats are: ${Object.keys(formatsAllowed).join(", ")}`,
    );
  }

  return formatter(dateObj);
}
