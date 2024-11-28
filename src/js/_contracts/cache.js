/**
 * @file cache.js
 * Abstract class for caches.
 * @abstract
 */

export default class Cache {
  constructor() {
    if (new.target === Cache) {
      throw new Error("Cannot instantiate abstract Cache class directly.");
    }
  }

  /**
   * @param {String} uri
   * @returns {Object} cached data or null if not found or expired
   */
  /* eslint-disable no-unused-vars */
  getCachedData(uri) {
    throw new Error("Method 'getCachedData(uri)' should be overridden in subclass.");
  }

  /**
   * @param {String} uri
   * @param {Object} data
   */
  /* eslint-disable no-unused-vars */
  setCachedData(uri, data) {
    throw new Error("Method 'setCachedData(uri, data)' should be overridden in subclass.");
  }
}
