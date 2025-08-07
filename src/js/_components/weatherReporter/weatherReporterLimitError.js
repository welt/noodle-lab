/**
 * @file weatherReporterLimitError.js
 * Custom error for enforcing WeatherReporterFactory instance limit.
 */
import { WEATHER_REPORTER_MAX_INSTANCES } from "./weatherReporterConfig.js";

export default class WeatherReporterLimitError extends Error {
  constructor(
    message = `Maximum of ${WEATHER_REPORTER_MAX_INSTANCES} WeatherReporter instances allowed`,
  ) {
    super(message);
    this.name = "WeatherReporterLimitError";
  }
}
