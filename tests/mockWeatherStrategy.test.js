import { jest } from "@jest/globals";
import MockWeatherStrategy from "../src/js/_components/weatherReporter/mockWeatherStrategy.js";

describe("MockWeatherStrategy", () => {
  it("should return mock weather data", async () => {
    const strategy = new MockWeatherStrategy();
    const data = await strategy.getWeatherData();
    expect(data).toEqual({
      location: "Mock City",
      temperature: 22,
      condition: "Sunny",
    });
  });
});
