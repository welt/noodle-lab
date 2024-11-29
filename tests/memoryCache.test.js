import { jest } from '@jest/globals';
import MemoryCache from '../src/js/_lib/memoryCache';

const testUri = "https://test.example.com";
const testData = { loremFakeKey: "ipsumFakeValue" };

describe("Test the MemoryCache implementation", () => {
  let cache;

  beforeEach(() => {
    cache = new MemoryCache();
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
    jest.spyOn(Date, 'now')
      .mockImplementation(() => now + 1000 * 60 * 10);
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
    };
    expect(cache.options).toEqual(expectedOptions);
  });
});
