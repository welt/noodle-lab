/**
 * @file blogStrategySwitch.test.js
 */
import { jest } from "@jest/globals";
import BlogStrategySwitch from "../../src/js/_components/blogFeature/blogStrategySwitch.js";
import EventBus from "../../src/js/_components/blogFeature/eventBus";

const eventBus = EventBus.getInstance();

describe("BlogStrategySwitch Custom Element", () => {
  beforeAll(() => {
    if (!customElements.get("blog-strategy-switch")) {
      customElements.define("blog-strategy-switch", BlogStrategySwitch);
    }
  });

  let switcher;

  beforeEach(() => {
    switcher = document.createElement("blog-strategy-switch");
    document.body.appendChild(switcher);
  });

  afterEach(() => {
    document.body.removeChild(switcher);
  });

  it("renders a select with memory and indexDB options", () => {
    const select = switcher.querySelector("[data-repo-strategy]");
    expect(select).not.toBeNull();
    expect(select.options.length).toBe(2);
    expect(select.options[0].value).toBe("memory");
    expect(select.options[1].value).toBe("indexDB");
  });

  it("emits switch-strategy event with correct detail on change", () => {
    const select = switcher.querySelector("[data-repo-strategy]");
    const handler = jest.fn();
    eventBus.on("switch-strategy", handler);

    select.value = "indexDB";
    select.dispatchEvent(new Event("change", { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0];
    expect(event.detail).toEqual({ strategy: "indexDB" });
  });
});
