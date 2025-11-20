import { jest } from '@jest/globals';
import CacheApiCache from '../src/js/_lib/cacheApiCache';

const baseUri = "https://test.example.com/resource";

const makeUri = (suffix = "") => `${baseUri}${suffix}?t=${Date.now()}`;

describe("CacheApiCache (JSON-only) implementation", () => {
  let cache;
  let cacheName;

  beforeAll(() => {
    cache = new CacheApiCache();
    cacheName = cache.options.cacheName;
  });

  beforeEach(async () => {
    const cacheStorage = await caches.open(cacheName);
    const keys = await cacheStorage.keys();
    await Promise.all(keys.map(request => cacheStorage.delete(request)));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    try {
      const cacheStorage = await caches.open(cacheName);
      const keys = await cacheStorage.keys();
      await Promise.all(keys.map(request => cacheStorage.delete(request)));
    } catch (err) {
      //
    }
  });

  test("returns null when nothing cached", async () => {
    const uri = makeUri("/none");
    const result = await cache.getCachedData(uri);
    expect(result).toBeNull();
  });

  test("caches and retrieves JSON data", async () => {
    const uri = makeUri("/json");
    const testData = { loremFakeKey: "ipsumFakeValue" };

    const ok = await cache.setCachedData(uri, testData);
    expect(ok).toBe(true);

    const cacheStorage = await caches.open(cacheName);
    const stored = await cacheStorage.match(uri);
    expect(stored).not.toBeUndefined();
    expect(stored.headers.get('x-cache-timestamp')).toBeTruthy();
    expect(stored.headers.get('content-type')).toMatch(/application\/json/);

    const result = await cache.getCachedData(uri);
    expect(result).toEqual(testData);
  });

  test("non-expired cached data is returned", async () => {
    const uri = makeUri("/fresh");
    const testData = { a: 1 };
    await cache.setCachedData(uri, testData);

    const result = await cache.getCachedData(uri);
    expect(result).toEqual(testData);
  });

  test("expired cached data is evicted and returns null", async () => {
    const uri = makeUri("/expired");
    const testData = { a: 2 };
    await cache.setCachedData(uri, testData);

    const originalNow = Date.now();
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => originalNow + 1000 * 60 * 6); // 6 minutes later

    const result = await cache.getCachedData(uri);
    expect(result).toBeNull();

    const cacheStorage = await caches.open(cacheName);
    const stored = await cacheStorage.match(uri);
    expect(stored).toBeUndefined();

    spy.mockRestore();
  });

  test("entry with no x-cache-timestamp is treated as missing and evicted", async () => {
    const uri = makeUri("/no-ts");
    const testData = { b: 3 };

    const cacheStorage = await caches.open(cacheName);
    const response = new Response(JSON.stringify(testData), {
      headers: { 'content-type': 'application/json' } // no x-cache-timestamp
    });
    await cacheStorage.put(uri, response);

    const result = await cache.getCachedData(uri);
    expect(result).toBeNull();

    const stored = await cacheStorage.match(uri);
    expect(stored).toBeUndefined();
  });

  test("malformed timestamp header is evicted and treated as missing", async () => {
    const uri = makeUri("/bad-ts");
    const cacheStorage = await caches.open(cacheName);
    const response = new Response(JSON.stringify({ c: 4 }), {
      headers: { 'content-type': 'application/json', 'x-cache-timestamp': 'not-a-number' }
    });
    await cacheStorage.put(uri, response);

    const result = await cache.getCachedData(uri);
    expect(result).toBeNull();

    const stored = await cacheStorage.match(uri);
    expect(stored).toBeUndefined();
  });

  test("corrupted JSON in cache is evicted and returns null", async () => {
    const uri = makeUri("/corrupt-json");
    const cacheStorage = await caches.open(cacheName);
    const response = new Response("{ invalid json", {
      headers: { 'content-type': 'application/json', 'x-cache-timestamp': String(Date.now()) }
    });
    await cacheStorage.put(uri, response);

    const result = await cache.getCachedData(uri);
    expect(result).toBeNull();

    const stored = await cacheStorage.match(uri);
    expect(stored).toBeUndefined();
  });

  test("setCachedData rejects non-object values", async () => {
    const uri = makeUri("/bad-data");
    const invalidData = "This is a lorem ipsum string";
    await expect(cache.setCachedData(uri, invalidData)).rejects.toThrow(TypeError);
  });

  test("options getter returns expected defaults", () => {
    const expectedOptions = {
      expiryTimeInMs: 1000 * 60 * 5,
      cacheName: 'api-cache',
    };
    expect(cache.options).toEqual(expectedOptions);
  });
});