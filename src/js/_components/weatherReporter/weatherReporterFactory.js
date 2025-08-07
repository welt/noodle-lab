/**
 * @file weatherReporterFactory.js
 */
import WeatherReporter from "./weatherReporter.js";
import WeatherReporterLimitError from "./weatherReporterLimitError.js";
import { WEATHER_REPORTER_MAX_INSTANCES } from "./weatherReporterConfig.js";

export default class WeatherReporterFactory {
  #instanceCount = 0;

  createWeatherReporter() {
    if (this.#instanceCount >= WEATHER_REPORTER_MAX_INSTANCES) {
      throw new WeatherReporterLimitError();
    }
    this.#instanceCount++;
    return new WeatherReporter();
  }
}
