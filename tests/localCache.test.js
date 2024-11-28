import LocalCache from '../src/js/_lib/localCache';

const testUri = "https://test.example.com";
const testData = { loremFakeKey: "ipsumFakeValue" };

describe("Test the LocalCache implementation", () => {
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

  test("It should return null if no cached data exists", () => {
    const result = cache.getCachedData(testUri);
    expect(result).toBeNull();
  });

  test("It should cache and retrieve data correctly", () => {
    cache.setCachedData(testUri, testData);
    const result = cache.getCachedData(testUri);
    expect(result).toEqual(testData);
  });

  test('It handles non-expired cached data correctly', () => {
    localStorage.setItem(cacheKey, JSON.stringify(testData));
    localStorage.setItem(timestampKey, (Date.now() - 1000).toString()); // 1 second ago
    const result = cache.getCachedData(testUri);
    expect(result).toEqual(testData);
  });

  test('It handles expired cached data correctly', () => {
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
