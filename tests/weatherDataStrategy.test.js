import { jest } from "@jest/globals";
import WeatherDataStrategy from "../src/js/_components/weatherReporter/contracts/weatherDataStrategy.js";

describe("WeatherDataStrategy", () => {
  it("should throw if getWeatherData is not implemented", async () => {
    const strategy = new WeatherDataStrategy();
    await expect(strategy.getWeatherData()).rejects.toThrow(
      "getWeatherData() must be implemented by subclass",
    );
  });
});
