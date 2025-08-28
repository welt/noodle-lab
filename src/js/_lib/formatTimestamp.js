/**
 * @file formatTimestamp.js
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
 */

const defaults = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

/**
 * @param {String} timestamp
 * @param {Object} options
 * @returns {String}
 */
export default function formatTimestamp(timestamp, options = {}) {
  const date = new Date(timestamp);
  const opts = { ...defaults, ...options };
  return date.toLocaleString("en-GB", opts);
}
