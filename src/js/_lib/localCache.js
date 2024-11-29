/**
 * @file sessionCache.js
 * A simple local storage cache implementation.
 * @extends Cache
 */
import isObject from './isObject';
import Cache from '../_contracts/cache';

const defaults = {
  expiryTimeInMs: 1000 * 60 * 5, // 5 minutes
  prefix: "cache_",
  suffix: "_timestamp",
};

export default class LocalCache extends Cache {
  constructor(options = {}) {
    super();
    this._options = { ...defaults, ...options };
  }

  getCachedData(uri) {
    const cacheKey = `${this.options.prefix}${uri}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(`${cacheKey}${this.options.suffix}`);

    if (!cachedData || !cachedTimestamp) {
      return null;
    }

    const now = Date.now();
    if (now - cachedTimestamp >= this.options.expiryTimeInMs) {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}${this.options.suffix}`);
      return null;
    }
    
    console.log(`Found cached data for ${uri}`);
    return JSON.parse(cachedData);
  }

  setCachedData(uri, data) {
    if (!isObject(data)) throw new TypeError("Data must be an object.");
    const cacheKey = `${this.options.prefix}${uri}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(`${cacheKey}${this.options.suffix}`, Date.now().toString());
  }

  get options() {
    return this._options;
  }
}
