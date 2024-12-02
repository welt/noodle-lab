/**
 * @file api.js
 * Wrapper around the Fetch API to make it easier
 * to fetch and optionally cache data from an API.
 */
/* eslint-disable no-unused-vars */
import CacheApiCache from "./cacheApiCache";
import CookieCache from './cookieCache';
import LocalCache from "./localCache";
import MemoryCache from "./memoryCache"; // !! Cache can not persist on page refresh.
import SessionCache from "./sessionCache";
/* eslint-enable no-unused-vars */

const defaultOptions = {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
  useCache: true, // !! Non-standard local option for this module.
  cacheStrategy: CacheApiCache, // !! Non-standard local option for this module.
};

const _privateFields = new WeakMap();

/**
 * Wrapper function with same signature as Fetch.
 * @param {String} uri
 * @param {Object} options
 * @constructor
 */
export default function Api(uri, options = {}) {
  if (!uri) {
    throw new Error("URI is required");
  }
  const { useCache, cacheStrategy, ...fetchOptions } = { ...defaultOptions, ...options };
  _privateFields.set(this, {
    uri,
    useCache: !!useCache,
    request: new Request(uri, fetchOptions),
    cache: new cacheStrategy(),
  });
}

Api.prototype.getData = async function () {
  const { uri, useCache, request, cache } = _privateFields.get(this);
  const cachedData = useCache && await cache.getCachedData(uri);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (useCache) {
      await cache.setCachedData(uri, data);
    }
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
 