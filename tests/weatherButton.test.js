import { jest } from "@jest/globals";
import WeatherReporterButton from "../src/js/_components/weatherReporter/weatherReporterButton.js";

if (!customElements.get("weather-reporter-button")) {
  customElements.define("weather-reporter-button", WeatherReporterButton);
}

describe("WeatherReporterButton", () => {
  let button;

  beforeEach(() => {
    button = document.createElement("weather-reporter-button");
    document.body.appendChild(button);
  });

  afterEach(() => {
    document.body.removeChild(button);
  });

  test("renders and attaches to the DOM", () => {
    expect(document.body.contains(button)).toBe(true);
  });

  test("emits 'add-weather-reporter' event on click", () => {
    const handler = jest.fn();
    button.addEventListener("add-weather-reporter", handler);

    button.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
