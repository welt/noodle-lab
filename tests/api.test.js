import { jest } from "@jest/globals";
import Api from "../src/js/_lib/api.js";

const networkErrorMessage = "Network response was not ok";
const consoleSpy = jest.spyOn(console, "error");
const eleventyUri = "https://api.github.com/repos/11ty/eleventy";
const customUri = "https://api.example.com";
const invalidUri = "https://invalid.example.com";

describe("The API helper handles args", () => {
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
});
