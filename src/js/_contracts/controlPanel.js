/**
 * @file controlPanel.js
 * Base class for control panel components.
 * @extends HTMLElement
 */

/**
 * Contract for ControlPanel classes.
 * @class ControlPanel
 * @extends HTMLElement
 */
export default class ControlPanel extends HTMLElement {
  constructor() {
    super();
    if (new.target === ControlPanel) {
      throw new Error(
        "Cannot instantiate abstract ControlPanel class directly.",
      );
    }
    this.render = this.render.bind(this);
  }

  /**
   * Renders data to the DOM.
   * This method should be overridden in the subclass.
   * @param {Object} data
   */
  /* eslint-disable no-unused-vars */
  render(data = {}) {
    throw new Error("Method 'render' should be overridden in subclass.");
  }
}
