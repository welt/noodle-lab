import { jest } from "@jest/globals";
import WizardControls from "../src/js/_components/wizardControls";

describe("WizardControls prototype", () => {
  test("methods exist on prototype", () => {
    expect(typeof WizardControls.prototype.onWizardsUpdated).toBe("function");
    expect(typeof WizardControls.prototype.onWizardAddedToStory).toBe(
      "function",
    );
  });

  test("onWizardsUpdated calls render with event detail", () => {
    const ctrl = Object.create(WizardControls.prototype);
    ctrl.render = jest.fn();
    const event = { detail: ["Merlin", "Gandalf"] };
    WizardControls.prototype.onWizardsUpdated.call(ctrl, event);
    expect(ctrl.render).toHaveBeenCalledWith(["Merlin", "Gandalf"]);
  });
});
