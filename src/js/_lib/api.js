/**
 * @file api.js
 * Wrapper around the Fetch API to make it easier
 * to fetch and optionally cache data from an API.
 */
/* eslint-disable no-unused-vars */
import LocalCache from "./localCache";
import MemoryCache from "./memoryCache";
import SessionCache from "./sessionCache";
/* eslint-enable no-unused-vars */

const defaultOptions = {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
  useCache: true, // !! Non-standard local option for this module.
  cacheStrategy: SessionCache, // !! Non-standard local option for this module.
};

const defaultUri = "https://api.github.com/repos/11ty/eleventy";

/**
 * Wrapper function with same signature as Fetch.
 * @param {String} uri
 * @param {Object} options
 * @constructor
 */
export default function Api(uri, options = {}) {
  this.uri = uri || defaultUri;
  const { useCache, cacheStrategy, ...fetchOptions } = { ...defaultOptions, ...options };
  this._useCache = !!useCache;
  this.request = new Request(this.uri, fetchOptions);
  this.cache = new cacheStrategy();
}

Api.prototype.getData = async function () {
  const cachedData = this.useCache && this.cache.getCachedData(this.uri);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(this.request);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (this.useCache) {
      this.cache.setCachedData(this.uri, data);
    }
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

Object.defineProperty(Api.prototype, "useCache", {
  get: function () {
    return this._useCache;
  },
  set: function (value) {
    this._useCache = !!value;
  },
});
