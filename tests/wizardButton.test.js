import { beforeAll, jest } from "@jest/globals";
import WizardButton from "../src/js/_components/wizardFeature/wizardButton";
import { registerCustomElements } from "../src/js/_lib/registerCustomElements.js";

beforeAll(() => {
  registerCustomElements();
});

describe("Test WizardButton implementation", () => {
  test("It binds onClick", () => {
    const btn = new WizardButton();
    expect(btn.onClick).toBeInstanceOf(Function);
  });

  test("It calls emit with correct arguments", () => {
    const btn = new WizardButton();
    btn.emit = jest.fn();
    const fakeEvent = { target: { textContent: "Merlin" } };
    btn.onClick(fakeEvent);
    expect(btn.emit).toHaveBeenCalledWith("add-wizard-to-story", "Merlin");
  });

  test("It has emit and subscribe methods", () => {
    expect(typeof WizardButton.prototype.emit).toBe("function");
    expect(typeof WizardButton.prototype.subscribe).toBe("function");
  });
});
