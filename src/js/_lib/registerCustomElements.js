/**
 * @file registerCustomElements.js
 */
import {
  WizardReporter,
  WizardButton,
  WizardControls,
} from "../_components/wizardFeature/index.js";
import {
  WeatherReporter,
  WeatherReporterButton,
} from "../_components/weatherReporter/index.js";
import CarbonReporter from "../_components/carbonReporter.js";
import GitHubReporter from "../_components/gitHubReporter.js";
import LoadingSpinner from "../_components/loadingSpinner.js";
import RandomReporter from "../_components/randomReporter.js";
import F1Reporter from "../_components/f1Reporter.js";
import ToggleButton from "../_components/toggleButton.js";
import RefreshButton from "../_components/refreshButton.js";
import ErrorDialog from "../_components/ErrorDialog.js";
import InfoDialog from "../_components/infoDialog.js";

export function registerCustomElements() {
  // Wizard Feature
  if (!customElements.get("wizard-reporter"))
    customElements.define("wizard-reporter", WizardReporter);
  if (!customElements.get("wizard-button"))
    customElements.define("wizard-button", WizardButton);
  if (!customElements.get("wizard-controls"))
    customElements.define("wizard-controls", WizardControls);

  // WeatherReporter Feature
  if (!customElements.get("weather-reporter"))
    customElements.define("weather-reporter", WeatherReporter);
  if (!customElements.get("weather-reporter-button"))
    customElements.define("weather-reporter-button", WeatherReporterButton);

  // Other Reporters & UI
  if (!customElements.get("carbon-reporter"))
    customElements.define("carbon-reporter", CarbonReporter);
  if (!customElements.get("github-reporter"))
    customElements.define("github-reporter", GitHubReporter);
  if (!customElements.get("loading-spinner"))
    customElements.define("loading-spinner", LoadingSpinner);
  if (!customElements.get("random-reporter"))
    customElements.define("random-reporter", RandomReporter);
  if (!customElements.get("f1-reporter"))
    customElements.define("f1-reporter", F1Reporter);
  if (!customElements.get("toggle-button"))
    customElements.define("toggle-button", ToggleButton);
  if (!customElements.get("refresh-button"))
    customElements.define("refresh-button", RefreshButton);

  // Dialogs
  if (!customElements.get("error-dialog"))
    customElements.define("error-dialog", ErrorDialog);
  if (!customElements.get("info-dialog"))
    customElements.define("info-dialog", InfoDialog);
}
