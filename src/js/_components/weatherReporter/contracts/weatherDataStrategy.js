/**
 * @file weatherDataStrategy.js
 * Contract class for weather data strategies.
 */
export default class WeatherDataStrategy {
  async getWeatherData() {
    throw new Error("getWeatherData() must be implemented by subclass");
  }
}
