/**
 * @file MockWeatherStrategy.js
 * Represents a weather strategy class for testing.
 */
import WeatherDataStrategy from "./contracts/weatherDataStrategy.js";
import { weatherCodeMap } from "./weatherCodeMap.js";

export default class MockWeatherStrategy extends WeatherDataStrategy {
  async getWeatherData() {
    return {
      city: "Capital City",
      latitude: 53.6012,
      longitude: -2.164,
      temperature: 21,
      condition: weatherCodeMap["61"] ?? "Sunny",
    };
  }
}
