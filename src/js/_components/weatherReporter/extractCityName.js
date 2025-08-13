/**
 * @file extractCityName.js
 * @param {object} address
 * @returns {string} city name extracted from the address object
 */
export default function extractCityName(address) {
  const candidates = [
    "city",
    "town",
    "village",
    "hamlet",
    "municipality",
    "county",
    "state_district",
    "state",
    "region",
    "country",
    "name",
  ];
  for (const key of candidates) {
    if (address?.[key]) return address[key];
  }
  return "Unknown location";
}
