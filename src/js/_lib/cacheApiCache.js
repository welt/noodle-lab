/**
 * @file cacheApiCache.js
 * A cache implementation that uses the browser's Cache API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 * @extends Cache
 */
import Cache from "../_contracts/cache";

const defaults = {
  expiryTimeInMs: 1000 * 60 * 5, // 5 minutes
  cacheName: "api-cache",
};

export default class CacheApiCache extends Cache {
  #options;

  constructor(options = {}) {
    super();
    this.#options = { ...defaults, ...options };
  }

  /**
   * Retrieve cached JSON for a URI.
   * Returns the parsed object/array,
   * or null if not present/invalid/expired.
   */
  async getCachedData(uri) {
    const { cacheName, expiryTimeInMs } = this.options;

    let cache;
    try {
      cache = await caches.open(cacheName);
    } catch (err) {
      console.warn("CacheApiCache.getCachedData: failed to open cache", err);
      return null;
    }

    const response = await cache.match(uri);

    if (!response) return null;

    const timestamp = response.headers.get("x-cache-timestamp");
    const cachedTimestamp = timestamp ? Number(timestamp) : NaN;
    
    if (!Number.isFinite(cachedTimestamp)) {
      await cache.delete(uri);
      return null;
    }

    const age = Date.now() - cachedTimestamp;
    if (age > expiryTimeInMs) {
      await cache.delete(uri);
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      await cache.delete(uri);
      return null;
    }

    try {
      return await response.json();
    } catch (err) {
      console.warn("CacheApiCache.getCachedData: failed to parse cached JSON, evicting", err);
      await cache.delete(uri);
      return null;
    }
  }

  /**
   * Stores JSON-serializable object or array with key `uri`.
   */
  async setCachedData(uri, data) {
    const { cacheName } = this.options;

    if (data === null || typeof data !== "object") {
      throw new TypeError("CacheApiCache only accepts plain objects or arrays.");
    }

    let body;
    try {
      body = JSON.stringify(data);
    } catch (err) {
      throw new TypeError("CacheApiCache data must be JSON-serializable.");
    }

    const timestamp = String(Date.now());
    const headers = new Headers({
      "content-type": "application/json",
      "x-cache-timestamp": timestamp,
    });

    const response = new Response(body, { headers });

    try {
      const cache = await caches.open(cacheName);
      await cache.put(uri, response);
      return true;
    } catch (err) {
      console.warn("CacheApiCache.setCachedData: failed to write to cache", err);
      return false;
    }
  }

  get options() {
    return this.#options;
  }
}
