import localDebug from "./_modules/localDebug.js";
import messages from "./_modules/messages.js";
import ToggleDarkMode from "./_lib/toggleDarkMode.js";
import DumpToScreen from "./_lib/dumpToScreen";
import createScreenLogger from "./_lib/screenLogger";
import CarbonReporter from "./_components/carbonReporter.js";
import GitHubReporter from "./_components/gitHubReporter.js";
import LoadingSpinner from "./_components/loadingSpinner.js";
import RandomReporter from "./_components/randomReporter.js";
import WeatherReporterFeature from "./_components/weatherReporter/weatherReporterFeature.js";
import WeatherReporterButton from "./_components/weatherReporter/weatherReporterButton.js";
import F1Reporter from "./_components/f1Reporter.js";
import ToggleButton from "./_components/toggleButton.js";
import RefreshButton from "./_components/refreshButton.js";
import { WizardFeature } from "./_components/wizardFeature/index.js";

window.WEATHER_REPORTER_FEATURE_ENABLED = true;
const WEATHER_REPORTER_FEATURE_ENABLED =
  window.WEATHER_REPORTER_FEATURE_ENABLED;
let weatherReporterFeature;

const wizardFeature = new WizardFeature("#main");
wizardFeature.init();

const screenLogger = createScreenLogger(DumpToScreen, "message-panel");

function defineCustomElements() {
  customElements.define("carbon-reporter", CarbonReporter);
  customElements.define("github-reporter", GitHubReporter);
  customElements.define("loading-spinner", LoadingSpinner);
  customElements.define("random-reporter", RandomReporter);
  customElements.define("f1-reporter", F1Reporter);
  customElements.define("toggle-button", ToggleButton);
  customElements.define("refresh-button", RefreshButton);
  if (!customElements.get("weather-reporter-button")) {
    customElements.define("weather-reporter-button", WeatherReporterButton);
  }
  if (WEATHER_REPORTER_FEATURE_ENABLED) {
    weatherReporterFeature = new WeatherReporterFeature("#main");
    weatherReporterFeature.init();
  }
}

// Optionally, to remove WeatherReporterFeature later:
// weatherReporterFeature.destroy();

function initializeThemeSwitch() {
  const themeSwitch = new ToggleDarkMode();
  themeSwitch.init();
}

function init() {
  localDebug.refresh();
  screenLogger();
  defineCustomElements();
  messages.hello();
  initializeThemeSwitch();
}

init();
