/**
 * @file api.js
 * Abstract contract class for API wrappers.
 * Extend this class to implement custom API clients.
 */

export default class ApiContract {
  /**
   * @param {string} uri - The endpoint to fetch
   * @param {Object} [options] - Optional fetch options or config
   */
  constructor(uri, options = {}) {
    if (new.target === ApiContract) {
      throw new Error(
        "Cannot instantiate abstract ApiContract class directly.",
      );
    }
    if (!uri) {
      throw new Error("URI is required for API contract.");
    }
    this.uri = uri;
    this.options = options;
  }

  /**
   * Fetches data from the API endpoint.
   * This method should be overridden in the subclass.
   * @returns {Promise<Object>} The data from the API.
   */
  async getData() {
    throw new Error("Method 'getData()' should be overridden in subclass.");
  }
}
