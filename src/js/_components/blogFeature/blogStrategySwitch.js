/**
 * @file blogStrategySwitch.js
 */
import EventBus from "./eventBus";

const eventBus = EventBus.getInstance();

const styles = ["button", "blog-strategy-switch"];

export default class BlogStrategySwitch extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <label>Blog storage:
        <select data-repo-strategy>
          <option value="memory">In-memory</option>
          <option value="indexDB">IndexDB</option>
        </select>
      </label>
    `;
    this.classList.add(...styles);

    this.select = this.querySelector("[data-repo-strategy]");

    this.select.addEventListener("change", (e) => {
      eventBus.emit("switch-strategy", { strategy: e.target.value });
    });

    eventBus.on("switch-strategy", (e) => {
      this.#updateStrategySelect(e.detail);
    });
  }

  #updateStrategySelect(detail) {
    this.select.value = detail.strategy;
  }
}
