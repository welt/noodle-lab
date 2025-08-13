import WeatherReporterFactory from "./weatherReporterFactory.js";
import WeatherReporter from "./weatherReporter.js";
import ErrorDialog from "../ErrorDialog.js";
import { WeatherReporterLimitError } from "./errors.js";
import GeolocationWeatherStrategy from "./geolocationWeatherStrategy.js";

/**
 * Facade for the WeatherReporter feature.
 * Encapsulates setup, event handling, and teardown logic.
 *
 * @class
 */
export default class WeatherReporterFeature {
  /**
   * Create a WeatherReporterFeature.
   * @param {string} containerSelector - Selector for container.
   * @param {HTMLElement} parent - Parent element for container.
   * @param {HTMLElement|null} errorDialog - Optional error dialog element.
   */
  constructor(
    containerSelector = "#weather-reporter-container",
    parent = document.body,
    errorDialog = null,
  ) {
    this.parent = parent;
    this.container =
      document.querySelector(containerSelector) ||
      (() => {
        const el = document.createElement("div");
        el.id = "weather-reporter-container";
        this.parent.appendChild(el);
        return el;
      })();
    this.factory = new WeatherReporterFactory();
    this.errorDialog =
      errorDialog ||
      document.querySelector("error-dialog") ||
      (() => {
        const el = document.createElement("error-dialog");
        this.parent.appendChild(el);
        return el;
      })();
    this.eventHandler = this.handleAddReporter.bind(this);
    this.initialized = false;
  }

  /**
   * Initialize the WeatherReporter feature.
   */
  init() {
    if (this.initialized) return;
    if (!customElements.get("weather-reporter")) {
      customElements.define("weather-reporter", WeatherReporter);
    }
    if (!customElements.get("error-dialog")) {
      customElements.define("error-dialog", ErrorDialog);
    }
    document.addEventListener("add-weather-reporter", this.eventHandler);
    this.initialized = true;
  }

  /**
   * Remove all feature elements and listeners from the DOM.
   */
  destroy() {
    if (!this.initialized) return;
    document.removeEventListener("add-weather-reporter", this.eventHandler);
    if (this.container.parentNode)
      this.container.parentNode.removeChild(this.container);
    if (this.errorDialog.parentNode)
      this.errorDialog.parentNode.removeChild(this.errorDialog);
    this.initialized = false;
  }

  /**
   * Handles add-weather-reporter event.
   * @private
   */
  handleAddReporter() {
    try {
      const reporter = this.factory.createWeatherReporter();
      reporter.setStrategy(new GeolocationWeatherStrategy());
      this.logMessage("Created: created new Reporter:> WeatherReporter");
      this.container.appendChild(reporter);
    } catch (err) {
      if (err instanceof WeatherReporterLimitError) {
        this.errorDialog.show(err.message);
        this.logMessage(`Errored: while creating WeatherReporter&hellip;`);
      } else {
        throw err;
      }
    }
  }

  logMessage(message) {
    console.log(`${message}`);
  }
}
