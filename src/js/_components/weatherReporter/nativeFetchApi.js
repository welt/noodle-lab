/**
 * @file nativeFetchApi.js
 * Simple API wrapper using native fetch, no cache.
 * Default API for WeatherReporter.
 */
import { GeocodingError } from "./errors.js";
import ApiContract from "../../_contracts/apiContract.js";

export default class NativeFetchApi extends ApiContract {
  /**
   * @param {string} uri - The endpoint to fetch
   * @param {Object} [options] - Optional fetch options
   */
  constructor(uri, options = {}) {
    super(uri, options);
    if (!uri) {
      throw new GeocodingError("URI is required");
    }
    this.uri = uri;
    this.options = options;
  }

  async getData() {
    let response, data;
    try {
      response = await fetch(this.uri, this.options);
    } catch (networkError) {
      throw new GeocodingError("Network error during geocoding request", {
        cause: networkError,
        uri: this.uri,
      });
    }
    if (!response.ok) {
      throw new GeocodingError("Failed to fetch city name", {
        status: response.status,
        statusText: response.statusText,
        uri: this.uri,
      });
    }
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new GeocodingError("Failed to parse geocoding response", {
        cause: jsonError,
        uri: this.uri,
      });
    }
    return data;
  }
}
