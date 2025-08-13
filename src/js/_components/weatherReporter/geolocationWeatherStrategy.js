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

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

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
  }

  async getWeatherData() {
    console.log("Getting weather data...");
    const position = await getLocation();
    const { latitude, longitude } = position.coords;

    let city = "Unknown location";
    try {
      city = await GeocodingService.getCityName(latitude, longitude);
      console.log("City data...", city);
    } catch (err) {
      if (err instanceof GeocodingError) {
        console.error("GEOCODING ERROR:", err.message);
        this.errorDialog.show(err.message);
      } else {
        throw err;
      }
    }

    // Query Open-Meteo for current weather
    const url = `${OPEN_METEO_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

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
