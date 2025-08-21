import { jest } from "@jest/globals";
import { WizardFeature } from "../src/js/_components/wizardFeature/index.js";
import { registerCustomElements } from "../src/js/_lib/registerCustomElements.js";

describe("WizardFeature facade", () => {
  let feature;
  let main;
  let reporter;

  beforeAll(() => {
    registerCustomElements();
    document.body.innerHTML = '<div id="main"></div>';
    feature = new WizardFeature("#main");
    feature.init();
    main = document.querySelector("#main");
    reporter = document.createElement("wizard-reporter");
    main.appendChild(reporter);
    // JSDom fix: ensures connectedCallback is called
    reporter.connectedCallback?.();
  });

  it("registers custom elements", () => {
    expect(customElements.get("wizard-reporter")).toBeDefined();
    expect(customElements.get("wizard-button")).toBeDefined();
    expect(customElements.get("wizard-controls")).toBeDefined();
  });

  it("renders the initial wizard list", () => {
    // Should show a <ul> with at least one <li> (initial wizards)
    // Updated to account for role attributes in the HTML
    expect(reporter.innerHTML).toMatch(/<ul[^>]*>[\s\S]*<li[^>]*>.*<\/li>[\s\S]*<\/ul>/);
  });

  it("updates the wizard list when a wizard is added", () => {
    // Simulate adding a wizard via the button event
    const addEvent = new CustomEvent("add-wizard-to-story", {
      detail: "Test Wizard",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(addEvent);

    // After event, the new wizard should appear in the list
    expect(reporter.innerHTML).toContain("Test Wizard");
    // Optionally, check the count - updated to account for role attributes
    const liCount = reporter.innerHTML.match(/<li[^>]*>/g)?.length || 0;
    expect(liCount).toBeGreaterThanOrEqual(4); // 3 initial + 1 added
  });
});
