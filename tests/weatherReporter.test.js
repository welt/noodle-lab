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
    await reporter.setStrategy(strategy);

    // Wait for async rendering
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(reporter.innerHTML).toContain("Local Weather");
    expect(reporter.innerHTML).toContain("Capital City");
    expect(reporter.innerHTML).toContain("53.6012");
    expect(reporter.innerHTML).toContain("-2.164");
    expect(reporter.innerHTML).toContain("21");
    expect(reporter.innerHTML).toContain(
      "Rain: Slight, moderate and heavy intensity",
    );
  });
});
