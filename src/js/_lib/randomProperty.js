/**
 * Returns a random property from an object as a key-value pair.
 * @param {Object} obj
 * @returns {Object}
 */
export default function randomProperty(obj) {
  const keys = Object.keys(obj);
  const random = Math.floor(Math.random() * keys.length);
  const key = keys[random];
  const value = obj[keys[random]];
  return { key, value };
}
