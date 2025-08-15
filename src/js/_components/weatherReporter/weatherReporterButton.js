/**
 * @file weatherReporterButton.js
 */
import eventMixin from "../../_mixins/eventMixin";
import mixinApply from "../../_lib/mixinApply";

const eventName = "add-weather-reporter";
const styles = ["button", "button--add-weather"];

export default class WeatherReporterButton extends HTMLElement {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  render() {
    this.classList.add(...styles);
  }

  onClick() {
    this.emit(eventName);
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", this.onClick);
    if (
      typeof window !== "undefined" &&
      !window.WEATHER_REPORTER_FEATURE_ENABLED
    ) {
      this.setAttribute("disabled", "");
      this.title = "WeatherReporter feature is disabled";
      console.warn("WeatherReporterButton: Feature is disabled.");
    }
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClick);
  }
}

mixinApply(WeatherReporterButton, eventMixin);
