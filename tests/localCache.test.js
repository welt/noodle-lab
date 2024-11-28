import Cache from '../src/js/_contracts/cache';
import LocalCache from '../src/js/_lib/localCache';

const testUri = "https://test.example.com";
const testData = { loremFakeKey: "ipsumFakeValue" };

describe("Test the cache", () => {
  let cache;
  let cacheKey;
  let timestampKey;

  beforeAll(() => {
    cache = new LocalCache();
    cacheKey = `cache_${testUri}`;
    timestampKey = `${cacheKey}_timestamp`;
  });

  beforeEach(() => {
    localStorage.clear();
  });

  test('It should implement getCachedData method', () => {
    expect(() => cache.getCachedData(testUri)).not.toThrow();
  });

  test('It should implement setCachedData method', () => {
    expect(() => cache.setCachedData(testUri, {})).not.toThrow();
  });

  test('It does not instantiate the abstract class', () => {
    expect(() => new Cache()).toThrow("Cannot instantiate abstract Cache class directly.");
  });

  test('It does not call getCachedData in the abstract class', () => {
    class TestCache extends Cache {}
    const instance = new TestCache();
    expect(() => instance.getCachedData(testUri)).toThrow("Method 'getCachedData(uri)' should be overridden in subclass.");
  });

  test('It does not call setCachedData in the abstract class', () => {
    class TestCache extends Cache {}
    const instance = new TestCache();
    expect(() => instance.setCachedData(testUri, {})).toThrow("Method 'setCachedData(uri, data)' should be overridden in subclass.");
  });

  test("It should return null if no cached data exists", () => {
    const result = cache.getCachedData(testUri);
    expect(result).toBeNull();
  });

  test("It should cache and retrieve data correctly", () => {
    cache.setCachedData(testUri, testData);
    const result = cache.getCachedData(testUri);
    expect(result).toEqual(testData);
  });

  test('It returns cached data if not expired', () => {
    localStorage.setItem(cacheKey, JSON.stringify(testData));
    localStorage.setItem(timestampKey, (Date.now() - 1000).toString()); // 1 second ago
    const result = cache.getCachedData(testUri);
    expect(result).toEqual(testData);
  });

  test('It removes cached data if expired', () => {
    localStorage.setItem(cacheKey, JSON.stringify(testData));
    localStorage.setItem(timestampKey, (Date.now() - 1000 * 60 * 6).toString()); // 6 minutes ago
    const result = cache.getCachedData(testUri);
    expect(result).toBeNull();
    expect(localStorage.getItem(cacheKey)).toBeNull();
    expect(localStorage.getItem(timestampKey)).toBeNull();
  });

  test("It throws a TypeError if data is not an object", () => {
    const invalidData = "This is a lorem ipsum string";
    expect(() => {
      cache.setCachedData(testUri, invalidData);
    }).toThrow(TypeError);
  });

  test('It should return the correct options', () => {
    const expectedOptions = {
      expiryTimeInMs: 1000 * 60 * 5,
      prefix: "cache_",
      suffix: "_timestamp",
    };
    expect(cache.options).toEqual(expectedOptions);
  });
});
