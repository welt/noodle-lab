import { jest } from '@jest/globals';
import CookieCache from '../src/js/_lib/cookieCache';

const testUri = "https://test.example.com";
const testData = { loremFakeKey: "ipsumFakeValue" };

describe("Test the CookieCache implementation", () => {
  let cache;

  beforeEach(() => {
    cache = new CookieCache();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;");
    });
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
    cache.setCachedData(testUri, testData);
    const result = cache.getCachedData(testUri);
    expect(result).toEqual(testData);
  });

  test('It handles expired cached data correctly', () => {
    cache.setCachedData(testUri, testData);
    const now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now + 1000 * 60 * 6); // 6 minutes later
    const result = cache.getCachedData(testUri);
    expect(result).toBeNull();
    Date.now.mockRestore();
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
      sameSite: "Strict",
    };
    expect(cache.options).toEqual(expectedOptions);
  });

  test('It does not cache data if the data size exceeds the cookie limit', () => {
    const largeData = { key: 'a'.repeat(5000) };
    console.warn = jest.fn();
    cache.setCachedData(testUri, largeData);
    const result = cache.getCachedData(testUri);
    expect(result).toBeNull();
  });
});
