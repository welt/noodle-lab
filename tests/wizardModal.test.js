import { jest } from "@jest/globals";
import {
  wizardStore,
  WizardFeature,
} from "../src/js/_components/wizardFeature/index.js";
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
    expect(reporter.innerHTML).toMatch(
      /<ul[^>]*>[\s\S]*<li>.*<\/li>[\s\S]*<\/ul>/,
    );
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
    // Optionally, check the count
    const liCount = reporter.innerHTML.match(/<li>/g)?.length || 0;
    expect(liCount).toBeGreaterThanOrEqual(4); // 3 initial + 1 added
  });

  it("should include a reset button in the rendered output", () => {
    expect(reporter.innerHTML).toContain("reset-button");
    expect(reporter.innerHTML).toContain("Reset Story");
  });

  it("resets the wizard story when reset button is clicked", () => {
    // First, add a wizard to the story
    const addEvent = new CustomEvent("add-wizard-to-story", {
      detail: "Test Wizard for Reset",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(addEvent);

    // Verify wizard was added
    expect(reporter.innerHTML).toContain("Test Wizard for Reset");

    // Count wizards before reset (should be at least 4: 3 initial + 1 added)
    const beforeResetCount = (reporter.innerHTML.match(/<li>/g) || []).length;
    expect(beforeResetCount).toBeGreaterThanOrEqual(4);

    // Simulate reset button click
    const resetEvent = new CustomEvent("reset-wizard-story", {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(resetEvent);

    // After reset, the story should be empty
    const afterResetCount = (reporter.innerHTML.match(/<li>/g) || []).length;
    expect(afterResetCount).toBe(0);
    expect(reporter.innerHTML).not.toContain("Test Wizard for Reset");
  });
});

describe("WizardFeature late wizard modal", () => {
  let wizardFeature;

  beforeEach(() => {
    document.body.innerHTML = "";
    while (wizardStore.length > 0) wizardStore.pop();
    wizardStore.push("Merlin", "Gandalf"); // Initial wizards
    wizardFeature = new WizardFeature("#main");
    wizardFeature.init();
  });

  it("shows modal when a new wizard is added", () => {
    const modalShowSpy = jest.spyOn(wizardFeature.modal, "show");
    wizardStore.push("Ursula");
    expect(modalShowSpy).toHaveBeenCalledWith(
      "Wizard Ursula apologised for arriving late.",
    );
  });

  it("does not show modal if no new wizard is added", () => {
    const modalShowSpy = jest.spyOn(wizardFeature.modal, "show");
    expect(modalShowSpy).not.toHaveBeenCalled();
  });
});
