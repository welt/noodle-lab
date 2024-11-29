/**
 * @file cookieCache.js
 * A simple cookie cache implementation.
 */
import isObject from './isObject';
import Cache from '../_contracts/cache';

const defaults = {
  expiryTimeInMs: 1000 * 60 * 5, // 5 minutes
  prefix: "cache_",
  sameSite: "Strict",
};

const setCookie = (name, value, expires, sameSite) => {
  const date = new Date();
  date.setTime(date.getTime() + expires);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=${sameSite}`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
};

export default class CookieCache extends Cache {
  constructor(options = {}) {
    super();
    this._options = { ...defaults, ...options };
  }

  getCachedData(uri) {
    const cacheKey = `${this._options.prefix}${uri}`;
    const cachedData = getCookie(cacheKey);
    const cachedTimestamp = getCookie(`${cacheKey}_timestamp`);

    if (!cachedData || !cachedTimestamp) {
      return null;
    }

    const now = Date.now();
    if (now - cachedTimestamp >= this._options.expiryTimeInMs) {
      deleteCookie(cacheKey);
      deleteCookie(`${cacheKey}_timestamp`);
      return null;
    }

    console.log(`Found cached data for ${uri}`);
    return JSON.parse(cachedData);
  }

  setCachedData(uri, data) {
    if (!isObject(data)) throw new TypeError("Data must be an object.");
    const cacheKey = `${this._options.prefix}${uri}`;
    const dataString = JSON.stringify(data);
    const { length } = dataString;
    if (length > 4000) {
      console.warn(`Data size ${length} exceeds cookie limit for ${uri}\nData will not be cached.`);
      return;
    }
    setCookie(cacheKey, dataString, this._options.expiryTimeInMs, this._options.sameSite);
    setCookie(`${cacheKey}_timestamp`, Date.now().toString(), this._options.expiryTimeInMs, this._options.sameSite);
  }

  get options() {
    return this._options;
  }
}
