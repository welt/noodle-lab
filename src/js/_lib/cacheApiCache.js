/**
 * @file cacheApiCache.js
 * A cache implementation that uses the browser's Cache API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 * @extends Cache
 */
import isObject from './isObject';
import Cache from '../_contracts/cache';

const defaults = {
  expiryTimeInMs: 1000 * 60 * 5, // 5 minutes
  cacheName: 'api-cache',
};

export default class CacheApiCache extends Cache {
  constructor(options = {}) {
    super();
    this._options = { ...defaults, ...options };
  }

  async getCachedData(uri) {
    const cache = await caches.open(this.options.cacheName);
    const response = await cache.match(uri);
    if (!response) {
      return null;
    }

    const cachedTimestamp = response.headers.get('x-cache-timestamp');
    if (!cachedTimestamp) {
      return null;
    }

    const now = Date.now();
    if (now - cachedTimestamp >= this.options.expiryTimeInMs) {
      await cache.delete(uri);
      return null;
    }

    console.log(`Found cached data for ${uri}`);
    return response.json();
  }

  async setCachedData(uri, data) {
    if (!isObject(data)) throw new TypeError("Data must be an object.");
    const cache = await caches.open(this.options.cacheName);
    const response = new Response(JSON.stringify(data), {
      headers: { 'x-cache-timestamp': Date.now().toString() }
    });
    await cache.put(uri, response);
  }

  get options() {
    return this._options;
  }
}
