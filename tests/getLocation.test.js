/**
 * @file getLocation.test.js
 */
import { jest } from "@jest/globals";
import getLocation from "../src/js/_components/weatherReporter/getLocation";
import { GeolocationError } from "../src/js/_components/weatherReporter/errors.js";

const originalGeolocation = window.navigator.geolocation;

describe("getLocation", () => {
  beforeAll(() => {
    // Mock browser Geolocation API.
    Object.defineProperty(window.navigator, "geolocation", {
      value: {
        getCurrentPosition: jest.fn(),
        watchPosition: jest.fn(),
        clearWatch: jest.fn(),
      },
      configurable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resolves with position when geolocation succeeds", async () => {
    const mockPosition = { coords: { latitude: 10, longitude: 20 } };
    window.navigator.geolocation.getCurrentPosition.mockImplementation(
      (success, error) => success(mockPosition),
    );
    await expect(getLocation()).resolves.toEqual(mockPosition);
    expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it("rejects with error when geolocation fails", async () => {
    const mockError = { code: 1, message: "User denied geolocation" };
    window.navigator.geolocation.getCurrentPosition.mockImplementation(
      (success, error) => error(mockError),
    );
    await expect(getLocation()).rejects.toThrow("User denied geolocation");
    await expect(getLocation()).rejects.toBeInstanceOf(GeolocationError);

    // Optionally, check the details property
    try {
      await getLocation();
    } catch (err) {
      expect(err.details).toEqual(mockError);
    }

    expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it("rejects if geolocation is not supported", async () => {
    delete window.navigator.geolocation;
    await expect(getLocation()).rejects.toThrow(
      "Geolocation is not supported by this browser.",
    );
  });

  afterAll(() => {
    Object.defineProperty(window.navigator, "geolocation", {
      value: originalGeolocation,
      configurable: true,
    });
  });
});
