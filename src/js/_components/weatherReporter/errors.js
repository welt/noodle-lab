/**
 * @file error.js
 * Custom errors for WeatherReporter feature.
 */
import { WEATHER_REPORTER_MAX_INSTANCES } from "./weatherReporterConfig.js";

class WeatherReporterLimitError extends Error {
  constructor(
    message = `Maximum of ${WEATHER_REPORTER_MAX_INSTANCES} WeatherReporter instances allowed`,
  ) {
    super(message);
    this.name = "WeatherReporterLimitError";
  }
}

class GeolocationError extends Error {
  constructor(message = "Geolocation error", details = {}) {
    super(message);
    this.name = "GeolocationError";
    this.details = details;
  }
}

class GeocodingError extends Error {
  constructor(message = "Geocoding error", details = {}) {
    super(message);
    this.name = "GeocodingError";
    this.details = details;
  }
}

class WeatherApiError extends Error {
  constructor(message = "Weather API error", details = {}) {
    super(message);
    this.name = "WeatherApiError";
    this.details = details;
  }
}

export {
  GeolocationError,
  GeocodingError,
  WeatherApiError,
  WeatherReporterLimitError,
};
