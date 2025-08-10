import { jest } from "@jest/globals";
import InfoButton from "../src/js/_components/infoFeature/infoButton.js";

describe("InfoButton", () => {
  beforeAll(() => {
    if (!customElements.get("info-button")) {
      customElements.define("info-button", InfoButton);
    }
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("adds the correct CSS classes on render", () => {
    const btn = document.createElement("info-button");
    document.body.appendChild(btn);
    expect(btn.classList.contains("button")).toBe(true);
    expect(btn.classList.contains("button--show-info")).toBe(true);
  });

  it("emits 'show-info' event with no detail when clicked", () => {
    const btn = document.createElement("info-button");
    document.body.appendChild(btn);

    const handler = jest.fn();
    document.addEventListener("show-info", handler);

    btn.click();

    expect(handler).toHaveBeenCalled();
    const event = handler.mock.calls[0][0];
    expect(event.type).toBe("show-info");
    expect(event.detail).toBeNull();
  });

  it("removes event listener on disconnect", () => {
    const spy = jest.spyOn(InfoButton.prototype, "removeEventListener");
    const btn = document.createElement("info-button");
    document.body.appendChild(btn);
    btn.remove();
    expect(spy).toHaveBeenCalledWith("click", btn.onClick);
    spy.mockRestore();
  });
});
