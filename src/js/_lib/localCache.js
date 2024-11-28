import Cache from '../_contracts/cache';

const options = {
  expiryTimeInMs: 1000 * 60 * 5, // 5 minutes
  prefix: "cache_",
  suffix: "_timestamp",
};

const isObject = (thing) => {
  return (
    thing !== null && typeof thing === "object" && thing.constructor === Object
  );
};

export default class LocalCache extends Cache {
  getCachedData(uri) {
    const cacheKey = `${options.prefix}${uri}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(`${cacheKey}${options.suffix}`);

    if (cachedData && cachedTimestamp) {
      const now = Date.now();
      if (now - cachedTimestamp < options.expiryTimeInMs) {
        return JSON.parse(cachedData);
      } else {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}${options.suffix}`);
      }
    }
    return null;
  }

  setCachedData(uri, data) {
    if (!isObject(data)) throw new TypeError("Data must be an object.");
    const cacheKey = `${options.prefix}${uri}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(`${cacheKey}${options.suffix}`, Date.now().toString());
  }

  get options() {
    return options;
  }
}
