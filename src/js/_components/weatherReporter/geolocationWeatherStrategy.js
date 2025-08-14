/**
 * @file geolocationWeatherStrategy.js
 * Weather data strategy using browser geolocation API
 * to fetch weather data from Open-Meteo.
 */
import { weatherCodeMap } from "./weatherCodeMap.js";
import WeatherDataStrategy from "./contracts/weatherDataStrategy.js";
import getLocation from "./getLocation.js";
import GeocodingService from "./geocodingService.js";
import { WeatherApiError, GeocodingError } from "./errors.js";
import Api from "../../_lib/api.js";

const url = new URL("https://api.open-meteo.com/v1/forecast");

export default class GeolocationWeatherStrategy extends WeatherDataStrategy {
  constructor(errorDialog = null) {
    super();
    this.errorDialog =
      errorDialog ||
      document.querySelector("error-dialog") ||
      (() => {
        const el = document.createElement("error-dialog");
        this.parent.appendChild(el);
        return el;
      })();
    this.geocodingService = new GeocodingService(Api);
  }

  async getWeatherData() {
    const position = await getLocation();
    const { latitude, longitude } = position.coords;

    let city = "Unknown location";
    try {
      city = await this.geocodingService.getCityName(latitude, longitude);
    } catch (err) {
      if (err instanceof GeocodingError) {
        this.errorDialog.show(err.message);
      } else {
        throw err;
      }
    }

    const params = new URLSearchParams({
      latitude,
      longitude,
      current_weather: true,
    });

    url.search = params;

    const response = await fetch(url);
    if (!response.ok)
      throw new WeatherApiError("Failed to fetch weather data", {
        status: response.status,
      });

    const data = await response.json();
    const weather = data.current_weather;

    return {
      city,
      latitude,
      longitude,
      temperature: weather?.temperature ?? null,
      condition: weatherCodeMap[weather?.weathercode] ?? "Unknown",
    };
  }
}
