import { jest } from '@jest/globals';
import CacheApiCache from '../src/js/_lib/cacheApiCache';

const testUri = "https://test.example.com";
const testData = { loremFakeKey: "ipsumFakeValue" };

describe("Test the CacheApiCache implementation", () => {
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

  test("It should return null if no cached data exists", async () => {
    const result = await cache.getCachedData(testUri);
    expect(result).toBeNull();
  });

  test("It should cache and retrieve data correctly", async () => {
    await cache.setCachedData(testUri, testData);
    const result = await cache.getCachedData(testUri);
    expect(result).toEqual(testData);
  });

  test('It handles non-expired cached data correctly', async () => {
    await cache.setCachedData(testUri, testData);
    const result = await cache.getCachedData(testUri);
    expect(result).toEqual(testData);
  });

  test('It handles expired cached data correctly', async () => {
    await cache.setCachedData(testUri, testData);
    const now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now + 1000 * 60 * 6); // 6 minutes later
    const result = await cache.getCachedData(testUri);
    expect(result).toBeNull();
    Date.now.mockRestore();
  });

  test("It should return null if cached data has no timestamp", async () => {
    const cacheStorage = await caches.open(cacheName);
    const response = new Response(JSON.stringify(testData), {
      headers: {} // No x-cache-timestamp header
    });
    await cacheStorage.put(testUri, response);
    const result = await cache.getCachedData(testUri);
    expect(result).toBeNull();
  });

  test("It throws a TypeError if data is not an object", async () => {
    const invalidData = "This is a lorem ipsum string";
    await expect(cache.setCachedData(testUri, invalidData)).rejects.toThrow(TypeError);
  });

  test('It should return the correct options', () => {
    const expectedOptions = {
      expiryTimeInMs: 1000 * 60 * 5,
      cacheName: 'api-cache',
    };
    expect(cache.options).toEqual(expectedOptions);
  });
});
