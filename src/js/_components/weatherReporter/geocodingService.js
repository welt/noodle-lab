/**
 * @file geocodingService.js
 * Service to query Open Street Map Nominatim
 * Geocoding API for closest city.
 */
import { GeocodingError } from "./errors.js";
import extractCityName from "./extractCityName.js";
import NativeFetchApi from "./nativeFetchApi.js";
import { isDuckType } from "../../_lib/isDucktype";
import ApiContract from "../../_contracts/apiContract.js";

const url = new URL("https://nominatim.openstreetmap.org/reverse");

const params = new URLSearchParams({
  format: "json",
  addressdetails: "1",
  lat: "",
  lon: "",
});

export default class GeocodingService {
  /**
   * @param {Function|null} ApiClass - Optional API wrapper class
   */
  constructor(ApiClass = NativeFetchApi) {
    isDuckType(new ApiClass("https://www.example.com"), ApiContract);
    this.ApiClass = ApiClass;
  }

  /**
   * Get city name from latitude and longitude.
   * @param {number|string} latitude
   * @param {number|string} longitude
   * @returns {Promise<string>} City name
   */
  async getCityName(latitude, longitude) {
    params.set("lat", latitude);
    params.set("lon", longitude);
    url.search = params;

    let data;
    const api = new this.ApiClass(url);

    try {
      data = await api.getData();
    } catch (err) {
      throw new GeocodingError("API wrapper error during geocoding request", {
        cause: err,
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
