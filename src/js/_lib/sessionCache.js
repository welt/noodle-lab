import Cache from '../_contracts/cache';

const defaults = {
  expiryTimeInMs: 1000 * 60 * 5, // 5 minutes
  prefix: "cache_",
  suffix: "_timestamp",
};

const isObject = (thing) => {
  return (
    thing !== null && typeof thing === "object" && thing.constructor === Object
  );
};

export default class SessionCache extends Cache {
  constructor(options = {}) {
    super();
    this._options = { ...defaults, ...options };
  }

  getCachedData(uri) {
    const cacheKey = `${this.options.prefix}${uri}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    const cachedTimestamp = sessionStorage.getItem(`${cacheKey}${this.options.suffix}`);

    if (!cachedData || !cachedTimestamp) {
      return null;
    }

    const now = Date.now();
    if (now - cachedTimestamp >= this.options.expiryTimeInMs) {
      sessionStorage.removeItem(cacheKey);
      sessionStorage.removeItem(`${cacheKey}${this.options.suffix}`);
      return null;
    }

    console.log(`Found cached data for ${uri}`);
    return JSON.parse(cachedData);
  }

  setCachedData(uri, data) {
    if (!isObject(data)) throw new TypeError("Data must be an object.");
    const cacheKey = `${this.options.prefix}${uri}`;
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    sessionStorage.setItem(`${cacheKey}${this.options.suffix}`, Date.now().toString());
  }

  get options() {
    return this._options;
  }
}
