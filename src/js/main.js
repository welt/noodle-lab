import localDebug from "./_modules/localDebug.js";
import messages from "./_modules/messages.js";
import ToggleDarkMode from "./_lib/toggleDarkMode.js";
import DumpToScreen from "./_lib/dumpToScreen";
import createScreenLogger from "./_lib/screenLogger";
import { WizardFeature } from "./_components/wizardFeature";
import { WeatherReporterFeature } from "./_components/weatherReporter";
import { InfoFeature } from "./_components/infoFeature";
import { registerCustomElements } from "./_lib/registerCustomElements.js";
import BlogFeatureFacade from "./_components/blogFeature";

const facades = [new BlogFeatureFacade()];
facades.forEach((facade) => facade.init());

const screenLogger = createScreenLogger(DumpToScreen, "message-panel");

window.WEATHER_REPORTER_FEATURE_ENABLED = true;
const WEATHER_REPORTER_FEATURE_ENABLED =
  window.WEATHER_REPORTER_FEATURE_ENABLED;
let weatherReporterFeature;

function initialiseFeatures() {
  const themeSwitch = new ToggleDarkMode();
  themeSwitch.init();

  const wizardFeature = new WizardFeature("#main");
  wizardFeature.init();

  if (WEATHER_REPORTER_FEATURE_ENABLED) {
    weatherReporterFeature = new WeatherReporterFeature("#main");
    weatherReporterFeature.init();
  }

  const infoDialog = document.createElement("info-dialog");
  document.body.appendChild(infoDialog);

  const infoFeature = new InfoFeature({ modal: infoDialog });
  infoFeature.init();
}

function init() {
  registerCustomElements();
  localDebug.refresh();
  screenLogger();
  messages.hello();
  initialiseFeatures();
}

init();
