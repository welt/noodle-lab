import CacheApiCache from '../../../_lib/cacheApiCache.js';

export default class FetchCache extends CacheApiCache {
  constructor() {
    super();
  }

  async getCachedData(key) {
    const cached = await super.getCachedData(key);
    if (cached instanceof Response) {
      return cached.clone();
    }
    return null;
  }

  async setCachedData(key, data) {
    if (data instanceof Response) {
      const cloned = data.clone();
      return super.setCachedData(key, cloned);
    }
    return super.setCachedData(key, data);
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new this();
      Object.freeze(this._instance);
    }
    return this._instance;
  }
}