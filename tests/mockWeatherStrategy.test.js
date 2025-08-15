import { jest } from "@jest/globals";
import MockWeatherStrategy from "../src/js/_components/weatherReporter/mockWeatherStrategy.js";

describe("MockWeatherStrategy", () => {
  test("should return mock weather data", async () => {
    const strategy = new MockWeatherStrategy();
    const data = await strategy.getWeatherData();
    expect(data).toEqual({
      city: "Capital City",
      latitude: 53.6012,
      longitude: -2.164,
      temperature: 21,
      condition: "Rain: Slight, moderate and heavy intensity",
    });
  });
});
