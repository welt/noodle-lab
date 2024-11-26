import { jest } from "@jest/globals";
import Api from "../src/js/_lib/api.js";

const networkErrorMessage = "Network response was not ok";
const consoleSpy = jest.spyOn(console, "error");
const eleventyUri = "https://api.github.com/repos/11ty/eleventy";
const customUri = "https://api.example.com";
const invalidUri = "https://invalid.example.com";
const mockCachedData = { loremFakeKey: "ipsumFakeValue" };

describe("Test the API handles args", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              name: "this is mocked data",
              stargazers_count: 999,
            },
          }),
      }),
    );
    global.Request = jest.fn((uri, options) => ({
      uri,
      options,
    }));
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
    delete global.Request;
  });

  test("It initializes with default uri", () => {
    const api = new Api();
    expect(api.uri).toBe(eleventyUri);
  });

  test("It initializes with custom uri", () => {
    const api = new Api(customUri);
    expect(api.uri).toBe(customUri);
  });

  test("It handles network errors", () => {
    const api = new Api(invalidUri);
    expect(api.getData()).rejects.toThrow(networkErrorMessage);
  });

  test("It logs any error", () => {
    const api = new Api(invalidUri);
    expect(consoleSpy).toBeCalled();
  });

  test("It should throw an error if the network response is not ok", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({}),
    });
    const api = new Api(customUri);
    await expect(api.getData()).rejects.toThrow("Network response was not ok");
  });

  test("It should return data if the network response is ok", async () => {
    const mockData = { loremFakeKey: "ipsumFakeValue" };
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });
    const api = new Api(customUri);
    const data = await api.getData();
    expect(data).toEqual(mockData);
  });

  test("It should set the _useCache property correctly", () => {
    const api = new Api(customUri);
    expect(api.useCache).toBe(true);
    api.useCache = false;
    expect(api.useCache).toBe(false);
    api.useCache = "lorem-ipsum-dolor-)(*&^%$#@!";
    expect(api.useCache).toBe(true);
    api.useCache = true;
    expect(api.useCache).toBe(true);
  });

  test("It should return cached data if useCache is true and data is cached", async () => {
    const api = new Api(customUri, { useCache: true });
    api.cache = {
      getCachedData: jest.fn().mockReturnValue(mockCachedData),
      setCachedData: jest.fn(),
    };
    const data = await api.getData();
    expect(data).toEqual(mockCachedData);
    expect(api.cache.getCachedData).toHaveBeenCalledWith(customUri);
  });

  test("It should not return cached data if useCache is false", async () => {
    const api = new Api(customUri, { useCache: false });
    api.cache = {
      getCachedData: jest.fn().mockReturnValue(null),
      setCachedData: jest.fn(),
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockCachedData),
    });
    const data = await api.getData();
    expect(data).toEqual(mockCachedData);
    expect(api.cache.getCachedData).not.toHaveBeenCalled();
  });
});
