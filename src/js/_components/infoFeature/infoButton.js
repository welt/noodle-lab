/**
 * @file InfoButton.js
 */
import eventMixin from "../../_mixins/eventMixin";
import mixinApply from "../../_lib/mixinApply";

const eventName = "show-info";
const styles = ["button", "button--show-info"];

export default class InfoButton extends HTMLElement {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  render() {
    this.classList.add(...styles);
  }

  /* eslint-disable no-unused-vars */
  onClick(event) {
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

mixinApply(InfoButton, eventMixin);
