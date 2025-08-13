/**
 * @file getLocation.js
 * Service to query browser Geolocation API.
 */
import { GeolocationError } from "./errors.js";

export default function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(new GeolocationError(error.message, error)),
      );
    } else {
      reject(
        new GeolocationError("Geolocation is not supported by this browser."),
      );
    }
  });
}
