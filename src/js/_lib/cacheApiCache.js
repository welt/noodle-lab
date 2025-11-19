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

  async getCachedData(uri) {
    const cache = await caches.open(this.options.cacheName);
    const response = await cache.match(uri);
    if (!response) {
      return null;
    }

    const cachedTimestamp = response.headers.get("x-cache-timestamp");
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
    const cache = await caches.open(this.options.cacheName);
    const timestamp = String(Date.now());

    if (data instanceof Response) {
      try {
        const cloned = data.clone();
        const bodyBuffer = await cloned.arrayBuffer();
        const headers = new Headers(cloned.headers);
        headers.set('x-cache-timestamp', timestamp);
        const resp = new Response(bodyBuffer, {
          status: cloned.status,
          statusText: cloned.statusText,
          headers,
        });
        await cache.put(uri, resp);
        return true;
      } catch (err) {
        console.warn('CacheApiCache.setCachedData (Response) failed', err);
        return false;
      }
    }

    if (data === null || (typeof data !== 'object')) {
      throw new TypeError('Cache data must be an object or array.');
    }

    try {
      const body = JSON.stringify(data);
      const headers = new Headers({
        'content-type': 'application/json',
        'x-cache-timestamp': timestamp,
      });
      const resp = new Response(body, { headers });
      await cache.put(uri, resp);
      return true;
    } catch (err) {
      console.warn('CacheApiCache.setCachedData (JSON) failed', err);
      return false;
    }
  }

  get options() {
    return this.#options;
  }
}
