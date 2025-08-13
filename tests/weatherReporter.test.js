import { jest } from "@jest/globals";
import WeatherReporter from "../src/js/_components/weatherReporter/weatherReporter.js";
import MockWeatherStrategy from "../src/js/_components/weatherReporter/mockWeatherStrategy.js";

describe("WeatherReporter", () => {
  let reporter;
  let strategy;

  beforeEach(() => {
    strategy = new MockWeatherStrategy();
    if (!customElements.get("weather-reporter")) {
      customElements.define("weather-reporter", WeatherReporter);
    }
    reporter = document.createElement("weather-reporter");
    reporter.strategy = strategy;
    document.body.appendChild(reporter);
  });

  afterEach(() => {
    if (reporter.parentNode) {
      reporter.parentNode.removeChild(reporter);
    }
  });

  it("should fetch and render weather data using the strategy", async () => {
    // Simulate connectedCallback
    await reporter.connectedCallback?.();

    // Wait for async rendering
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(reporter.innerHTML).toContain("Weather report for your area");
    expect(reporter.innerHTML).toContain("Mock City");
    expect(reporter.innerHTML).toContain("22");
    expect(reporter.innerHTML).toContain("Sunny");
  });

  it("should show an error message if strategy fails", async () => {
    strategy.getWeatherData = jest.fn().mockRejectedValue(new Error("Failed"));
    reporter = document.createElement("weather-reporter");
    reporter.strategy = strategy;
    document.body.appendChild(reporter);

    await reporter.connectedCallback?.();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(reporter.innerHTML).toContain("Error fetching weather data");
  });
});
