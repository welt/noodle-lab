import localDebug from "./_modules/localDebug.js";
import messages from "./_modules/messages.js";
import ToggleDarkMode from "./_lib/toggleDarkMode.js";
import DumpToScreen from "./_lib/dumpToScreen";
import createScreenLogger from "./_lib/screenLogger";
import { WizardFeature } from "./_components/wizardFeature/index.js";
import { WeatherReporterFeature } from "./_components/weatherReporter/index.js";
import { registerCustomElements } from "./_lib/registerCustomElements.js";

window.WEATHER_REPORTER_FEATURE_ENABLED = true;
const WEATHER_REPORTER_FEATURE_ENABLED =
  window.WEATHER_REPORTER_FEATURE_ENABLED;
let weatherReporterFeature;

const wizardFeature = new WizardFeature("#main");
wizardFeature.init();

const screenLogger = createScreenLogger(DumpToScreen, "message-panel");

function initializeThemeSwitch() {
  const themeSwitch = new ToggleDarkMode();
  themeSwitch.init();
}

function init() {
  localDebug.refresh();
  screenLogger();
  registerCustomElements();
  messages.hello();
  initializeThemeSwitch();
  if (WEATHER_REPORTER_FEATURE_ENABLED) {
    weatherReporterFeature = new WeatherReporterFeature("#main");
    weatherReporterFeature.init();
  }
}

init();
