import CacheApiCache from '../../../_lib/cacheApiCache.js';

export default class FetchCache extends CacheApiCache {
  static #instance = null;

  constructor(options = {}) {
    super(options);
  }

  async getCachedData(key) {
    const cached = await super.getCachedData(key);
    if (cached instanceof Response) {
      return cached.clone();
    }
    return cached; 
  }

  async setCachedData(key, data) {
    if (data instanceof Response) {
      const cloned = data.clone();
      return super.setCachedData(key, cloned);
    }
    return super.setCachedData(key, data);
  }

  static getInstance(options = {}) {
    if (!this.#instance) {
      this.#instance = new this(options);
      Object.freeze(this.#instance);
    }
    return this.#instance;
  }
}