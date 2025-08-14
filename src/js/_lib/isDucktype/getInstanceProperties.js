/**
 * Gets instance properties of a class.
 * @file getInstanceProperties.js
 */

/**
 * Get instance properties of a class.
 * @param {Class} clazz
 * @returns {string[]} - Array of property names.
 */
export default function getInstanceProperties(clazz) {
  let instance;
  try {
    instance = new clazz("dummy", {});
    /* eslint-disable no-unused-vars */
  } catch (err) {
    instance = {};
  }
  return Object.keys(instance);
}
