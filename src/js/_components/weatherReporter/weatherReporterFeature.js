import WeatherReporterFactory from "./weatherReporterFactory.js";
import WeatherReporter from "./weatherReporter.js";
import ErrorDialog from "../ErrorDialog.js";
import WeatherReporterLimitError from "./weatherReporterLimitError.js";

/**
 * Facade for the WeatherReporter feature.
 * Encapsulates all setup, event handling, and teardown logic.
 *
 * @class
 * @example
 *   const feature = new WeatherReporterFeature();
 *   feature.init();
 *   // ... later ...
 *   feature.destroy();
 */
export default class WeatherReporterFeature {
  /**
   * Create a WeatherReporterFeature.
   * @param {string} [containerSelector="#weather-reporter-container"] - Selector for the container element.
   * @param {HTMLElement} [parent=document.body] - Parent element to append the container to.
   * @param {HTMLElement|null} [errorDialog=null] - Optional error dialog element to use.
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
   * Registers custom elements and event listeners,
   * and ensures the container and error dialog are in the DOM.
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
   * Cleans up the container, error dialog, and event listeners.
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
   * Handle the add-weather-reporter event.
   * Creates a new WeatherReporter if under the limit,
   * otherwise shows an error dialog.
   * @private
   */
  handleAddReporter() {
    try {
      const reporter = this.factory.createWeatherReporter();
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
