/**
 * @file memoryCache.js
 * A simple in-memory cache implementation.
 * !! This cache does not persist on page refresh.
 * @extends Cache
 */
import isObject from './isObject';
import Cache from '../_contracts/cache';

const defaults = {
  expiryTimeInMs: 1000 * 60 * 5, // 5 minutes
};

export default class MemoryCache extends Cache {
  #cacheMap;
  #timestampMap;
  #options;

  constructor(options = {}) {
    super();
    this.#options = { ...defaults, ...options };
    this.#cacheMap = new Map();
    this.#timestampMap = new Map();
  }

  getCachedData(uri) {
    const cachedData = this.#cacheMap.get(uri);
    const cachedTimestamp = this.#timestampMap.get(uri);

    if (!cachedData || !cachedTimestamp) {
      return null;
    }

    const now = Date.now();
    if (now - cachedTimestamp >= this.options.expiryTimeInMs) {
      this.#cacheMap.delete(uri);
      this.#timestampMap.delete(uri);
      return null;
    }
    
    console.log(`Found cached data for ${uri}`);
    return cachedData;
  }

  setCachedData(uri, data) {
    if (!isObject(data)) throw new TypeError("Data must be an object.");
    this.#cacheMap.set(uri, data);
    this.#timestampMap.set(uri, Date.now());
  }

  get options() {
    return this.#options;
  }
}
