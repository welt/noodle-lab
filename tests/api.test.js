import { jest } from "@jest/globals";
import Api from "../src/js/_lib/api.js";

const customUri = "https://api.example.com";
const mockCachedData = { loremFakeKey: "ipsumFakeValue" };
const missingUriMessage = "URI is required";
const networkErrorMessage = "Network response was not ok";

describe("Test the API handles args", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
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

  test("It throws an error if no URI is provided", () => {
    expect(() => new Api()).toThrow(missingUriMessage);
  });

  test("It should throw an error if the network response is not ok", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({}),
    });
    const api = new Api(customUri);
    await expect(api.getData()).rejects.toThrow(networkErrorMessage);
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

  test("It should return cached data if useCache is true and data is cached", async () => {
    const mockCache = {
      getCachedData: jest.fn().mockReturnValue(mockCachedData),
      setCachedData: jest.fn(),
    };
    const MockCacheStrategy = jest.fn(() => mockCache);
    const api = new Api(customUri, { useCache: true, cacheStrategy: MockCacheStrategy });
    const data = await api.getData();
    expect(data).toEqual(mockCachedData);
    expect(mockCache.getCachedData).toHaveBeenCalledWith(customUri);
  });

  test("It should not return cached data if useCache is false", async () => {
    const mockCache = {
      getCachedData: jest.fn().mockReturnValue(null),
      setCachedData: jest.fn(),
    };
    const MockCacheStrategy = jest.fn(() => mockCache);
    const api = new Api(customUri, { useCache: false, cacheStrategy: MockCacheStrategy });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockCachedData),
    });
    const data = await api.getData();
    expect(data).toEqual(mockCachedData);
    expect(mockCache.getCachedData).not.toHaveBeenCalled();
  });
});
