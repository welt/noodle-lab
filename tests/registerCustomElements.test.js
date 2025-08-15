import { registerCustomElements } from "../src/js/_lib/registerCustomElements.js";

describe("registerCustomElements", () => {
  beforeAll(() => {
    registerCustomElements();
  });

  const elements = [
    "error-dialog",
    "info-dialog",
    "wizard-reporter",
    "wizard-button",
    "wizard-controls",
    "weather-reporter",
    "weather-reporter-button",
    "info-feature",
    "info-button",
    "carbon-reporter",
    "github-reporter",
    "loading-spinner",
    "random-reporter",
    "f1-reporter",
    "toggle-button",
    "refresh-button",
    "github-link-button",
  ];

  elements.forEach((tag) => {
    it(`registers <${tag}>`, () => {
      expect(customElements.get(tag)).toBeDefined();
    });
  });
});
