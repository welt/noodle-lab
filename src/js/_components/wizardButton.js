/**
 * @file wizardButton.js
 */
import eventMixin from "../_mixins/eventMixin";
import mixinApply from "../_lib/mixinApply";

const eventName = "add-wizard-to-story";
const styles = ["button", "button--add-wizard"];

export default class WizardButton extends HTMLElement {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  render() {
    this.classList.add(...styles);
  }

  onClick(event) {
    this.emit(eventName, event.target.textContent);
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", this.onClick);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClick);
  }
}

mixinApply(WizardButton, eventMixin);
