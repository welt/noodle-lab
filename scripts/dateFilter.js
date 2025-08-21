/**
 * @file scripts/dateFilter.js
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
  let dateObj;
  if (value === "now") {
    dateObj = new Date();
  } else {
    dateObj = new Date(value);
  }

  const formatter = formatsAllowed[format];

  if (!formatter) {
    throw new Error(
      `Unsupported date format: "${format}". Allowed formats are: ${Object.keys(formatsAllowed).join(", ")}`,
    );
  }
  return formatter(dateObj);
}
