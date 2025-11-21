export default {
  async deleteCachesByPrefix(prefix) {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        if (request.url.startsWith(prefix)) {
          await cache.delete(request);
        }
      }
    }
  },
};
