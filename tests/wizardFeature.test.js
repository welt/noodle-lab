import { jest } from "@jest/globals";
import { WizardFeature } from "../src/js/_components/wizardFeature/index.js";

describe("test the WizardFeature facade", () => {
  let feature;
  let main;
  let reporter;

  beforeAll(() => {
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
    expect(reporter.innerHTML).toMatch(/<ul>[\s\S]*<li>.*<\/li>[\s\S]*<\/ul>/);
  });

  it("updates the wizard list when a wizard is added", () => {
    const addEvent = new CustomEvent("add-wizard-to-story", {
      detail: "Fake Wizard Name",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(addEvent);

    expect(reporter.innerHTML).toContain("Fake Wizard Name");
    const listItemCount = reporter.innerHTML.match(/<li>/g)?.length || 0;
    // 3 initial wizards plus one added wizard = four.
    expect(listItemCount).toBeGreaterThanOrEqual(4);
  });
});
