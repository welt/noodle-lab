/**
 * @file geocodingService.js
 * Service to query Open Street Map Nominatim
 * Geocoding API for closest city.
 */
import { GeocodingError } from "./errors.js";
import extractCityName from "./extractCityName.js";

export default class GeocodingService {
  static async getCityName(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10&addressdetails=1&extratags=1&namedetails=1`;
    let response, data;
    try {
      response = await fetch(url);
    } catch (networkError) {
      throw new GeocodingError("Network error during geocoding request", {
        cause: networkError,
      });
    }
    if (!response.ok) {
      throw new GeocodingError("Failed to fetch city name", {
        status: response.status,
      });
    }
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new GeocodingError("Failed to parse geocoding response", {
        cause: jsonError,
      });
    }
    if (!data?.address) {
      throw new GeocodingError("No address data found in geocoding response", {
        response: data,
      });
    }
    return extractCityName(data.address);
  }
}
