/**
 * Returns a random property from an object as a key-value pair.
 * @param {Object} object
 * @returns {Object} new object with a random key-value pair
 */
export default function randomProperty(obj) {
  const keys = Object.keys(obj);
  if (!keys.length) return {};
  const random = Math.floor(Math.random() * keys.length);
  const key = keys[random];
  return { [key]: obj[key] };
}
