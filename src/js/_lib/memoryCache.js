import Cache from '../_contracts/cache';

const defaults = {
  expiryTimeInMs: 1000 * 60 * 5, // 5 minutes
};

const isObject = (thing) => {
  return (
    thing !== null && typeof thing === "object" && thing.constructor === Object
  );
};

export default class MemoryCache extends Cache {
  #cacheMap;
  #timestampMap;

  constructor(options = {}) {
    super();
    this._options = { ...defaults, ...options };
    this.#cacheMap = new Map();
    this.#timestampMap = new Map();
  }

  getCachedData(uri) {
    const cachedData = this.#cacheMap.get(uri);
    const cachedTimestamp = this.#timestampMap.get(uri);

    if (!cachedData || !cachedTimestamp) {
      return null;
    }

    console.log(`Found cached data for ${uri}`);
    const now = Date.now();
    if (now - cachedTimestamp >= this.options.expiryTimeInMs) {
      this.#cacheMap.delete(uri);
      this.#timestampMap.delete(uri);
      return null;
    }

    return cachedData;
  }

  setCachedData(uri, data) {
    if (!isObject(data)) throw new TypeError("Data must be an object.");
    this.#cacheMap.set(uri, data);
    this.#timestampMap.set(uri, Date.now());
  }

  get options() {
    return this._options;
  }
}
