import { jest } from "@jest/globals";
import WeatherReporterFeature from "../src/js/_components/weatherReporter/weatherReporterFeature.js";
import WeatherReporterButton from "../src/js/_components/weatherReporter/weatherReporterButton.js";
import WeatherReporter from "../src/js/_components/weatherReporter/weatherReporter.js";

describe("WeatherReporterFeature", () => {
  let feature;
  let parent;

  beforeEach(() => {
    parent = document.createElement("section");
    parent.id = "test-parent";
    document.body.appendChild(parent);

    feature = new WeatherReporterFeature(
      "#test-weather-reporter-container",
      parent,
    );
    feature.init();
  });

  afterEach(() => {
    feature.destroy();
    if (parent.parentNode) parent.parentNode.removeChild(parent);
  });

  test("initializes and appends container and error dialog to the specified parent", () => {
    expect(parent.contains(feature.container)).toBe(true);
    expect(parent.contains(feature.errorDialog)).toBe(true);
  });

  test("creates a WeatherReporter in the correct container on event", () => {
    if (!customElements.get("weather-reporter-button")) {
      customElements.define("weather-reporter-button", WeatherReporterButton);
    }
    const button = document.createElement("weather-reporter-button");
    parent.appendChild(button);

    button.click();

    const reporters = feature.container.querySelectorAll("weather-reporter");
    expect(reporters.length).toBe(1);
    expect(reporters[0]).toBeInstanceOf(WeatherReporter);

    parent.removeChild(button);
  });

  test("enforces the instance limit and shows error dialog on fourth attempt", async () => {
    if (!customElements.get("weather-reporter-button")) {
      customElements.define("weather-reporter-button", WeatherReporterButton);
    }
    const button = document.createElement("weather-reporter-button");
    parent.appendChild(button);

    for (let i = 0; i < 3; i++) {
      button.click();
    }
    button.click();

    const nativeDialog = feature.errorDialog.shadowRoot.querySelector("dialog");
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(nativeDialog.open).toBe(true);
    expect(nativeDialog.textContent).toContain(
      "Maximum of 3 WeatherReporter instances allowed",
    );

    parent.removeChild(button);
  });

  test("destroy removes container and error dialog from the DOM", () => {
    feature.destroy();
    expect(parent.contains(feature.container)).toBe(false);
    expect(parent.contains(feature.errorDialog)).toBe(false);
  });
});
