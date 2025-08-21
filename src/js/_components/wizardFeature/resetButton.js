/**
 * @file resetButton.js
 */
import eventMixin from "../../_mixins/eventMixin.js";
import mixinApply from "../../_lib/mixinApply.js";

const eventName = "reset-wizard-story";
const styles = ["button", "button--reset"];

export default class ResetButton extends HTMLElement {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  render() {
    this.classList.add(...styles);
  }

  onClick() {
    this.emit(eventName);
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", this.onClick);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClick);
  }
}

mixinApply(ResetButton, eventMixin);