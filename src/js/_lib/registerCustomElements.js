/**
 * @file registerCustomElements.js
 */
import {
  WizardReporter,
  WizardButton,
  WizardControls,
  ResetButton,
  WizardModal,
} from "../_components/wizardFeature/index.js";
import {
  WeatherReporter,
  WeatherReporterButton,
} from "../_components/weatherReporter/index.js";
import { InfoFeature, InfoButton } from "../_components/infoFeature/index.js";
import CarbonReporter from "../_components/carbonReporter.js";
import GitHubReporter from "../_components/gitHubReporter.js";
import LoadingSpinner from "../_components/loadingSpinner.js";
import RandomReporter from "../_components/randomReporter.js";
import F1Reporter from "../_components/f1Reporter.js";
import ToggleButton from "../_components/toggleButton.js";
import RefreshButton from "../_components/refreshButton.js";
import ErrorDialog from "../_components/ErrorDialog.js";
import InfoDialog from "../_components/infoDialog.js";
import GitHubLinkButton from "../_components/gitHubLinkButton.js";
import RssFeedLinkButton from "../_components/rssFeedLinkButton.js";
import DigitalRain from "../_components/digitalRain";
import ImageSwap from "../_components/imageSwap";

export function registerCustomElements() {
  // Dialogs
  if (!customElements.get("error-dialog"))
    customElements.define("error-dialog", ErrorDialog);
  if (!customElements.get("info-dialog")) {
    customElements.define("info-dialog", InfoDialog);
  }

  // Wizard Feature
  if (!customElements.get("wizard-reporter"))
    customElements.define("wizard-reporter", WizardReporter);
  if (!customElements.get("wizard-button"))
    customElements.define("wizard-button", WizardButton);
  if (!customElements.get("wizard-controls"))
    customElements.define("wizard-controls", WizardControls);
  if (!customElements.get("reset-button"))
    customElements.define("reset-button", ResetButton);
  if (!customElements.get("wizard-modal"))
    customElements.define("wizard-modal", WizardModal);

  // WeatherReporter Feature
  if (!customElements.get("weather-reporter"))
    customElements.define("weather-reporter", WeatherReporter);
  if (!customElements.get("weather-reporter-button"))
    customElements.define("weather-reporter-button", WeatherReporterButton);

  // InfoFeature Feature
  if (!customElements.get("info-feature"))
    customElements.define("info-feature", InfoFeature);
  if (!customElements.get("info-button"))
    customElements.define("info-button", InfoButton);

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
  if (!customElements.get("github-link-button"))
    customElements.define("github-link-button", GitHubLinkButton);
  if (!customElements.get("rss-feed-link-button"))
    customElements.define("rss-feed-link-button", RssFeedLinkButton);
  if (!customElements.get("loading-spinner"))
    customElements.define("loading-spinner", LoadingSpinner);
  if (!customElements.get("digital-rain"))
    customElements.define("digital-rain", DigitalRain);
  if (!customElements.get("image-swap"))
    customElements.define("image-swap", ImageSwap);
}
