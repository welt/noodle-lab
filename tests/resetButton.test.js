import { jest } from "@jest/globals";
import ResetButton from "../src/js/_components/wizardFeature/resetButton.js";
import { registerCustomElements } from "../src/js/_lib/registerCustomElements.js";

describe("Test ResetButton implementation", () => {
  beforeAll(() => {
    registerCustomElements();
  });

  test("It binds onClick", () => {
    const btn = new ResetButton();
    expect(btn.onClick).toBeInstanceOf(Function);
  });

  test("It calls emit with correct event name", () => {
    const btn = new ResetButton();
    btn.emit = jest.fn();
    btn.onClick();
    expect(btn.emit).toHaveBeenCalledWith("reset-wizard-story");
  });

  test("It has emit and subscribe methods", () => {
    expect(typeof ResetButton.prototype.emit).toBe("function");
    expect(typeof ResetButton.prototype.subscribe).toBe("function");
  });

  test("It adds correct CSS classes on render", () => {
    const btn = new ResetButton();
    btn.render();
    expect(btn.classList.contains("button")).toBe(true);
    expect(btn.classList.contains("button--reset")).toBe(true);
  });
});