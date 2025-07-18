/**
 * @file refreshButton.js
 */
import eventMixin from "../_mixins/eventMixin";
import mixinApply from "../_lib/mixinApply";

const eventName = "refresh";
const styles = ["button", "button--refresh"];

export default class RefreshButton extends HTMLElement {
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

mixinApply(RefreshButton, eventMixin);
