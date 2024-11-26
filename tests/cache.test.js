import { cache } from "../src/js/_lib/cache";

const testUri = "https://test.example.com";

describe("Test the cache", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("It should return null if no cached data exists", () => {
    const result = cache.getCachedData(testUri);
    expect(result).toBeNull();
  });

  test("It should cache and retrieve data correctly", () => {
    const testData = { loremFakeKey: "ipsumFakeValue" };
    cache.setCachedData(testUri, testData);
    const result = cache.getCachedData(testUri);
    expect(result).toEqual(testData);
  });

  test("It should throw a TypeError if data is not an object", () => {
    const invalidData = "This is a lorem ipsum string";
    expect(() => {
      cache.setCachedData(testUri, invalidData);
    }).toThrow(TypeError);
  });

  test("It should return null if cached data is expired", () => {
    const testData = { loremFakeKey: "ipsumFakeValue" };
    const { expiryTimeInMs, prefix, suffix } = cache.options;
    cache.setCachedData(testUri, testData);
    const cacheKey = `${prefix}${testUri}${suffix}`;
    localStorage.setItem(
      cacheKey,
      (Date.now() - expiryTimeInMs - 10000).toString(),
    );
    const result = cache.getCachedData(testUri);
    expect(result).toBeNull();
  });
});
