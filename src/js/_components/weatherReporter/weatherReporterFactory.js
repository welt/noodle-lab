/**
 * @file weatherReporterFactory.js
 */
import WeatherReporter from "./weatherReporter.js";
import { WeatherReporterLimitError } from "./errors.js";
import { WEATHER_REPORTER_MAX_INSTANCES } from "./config.js";

export default class WeatherReporterFactory {
  #instanceCount = 0;

  createWeatherReporter() {
    if (this.#instanceCount >= WEATHER_REPORTER_MAX_INSTANCES) {
      throw new WeatherReporterLimitError();
    }
    this.#instanceCount++;
    return new WeatherReporter();
  }

  set instanceCount(value) {
    if (typeof value === "number" && value >= 0) {
      this.#instanceCount = value;
    } else {
      throw new TypeError("instanceCount must be a non-negative number");
    }
  }

  get instanceCount() {
    return this.#instanceCount;
  }
}
