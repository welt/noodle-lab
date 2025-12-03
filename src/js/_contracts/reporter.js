/**
 * @file reporter.js
 * Base class for API data reporters.
 * @extends HTMLElement
 * @requires Api
 * @requires eventMixin
 * @subscribes refresh
 */
import Api from "../_lib/api.js";

const eventName = "refresh";

const warning = (_strings, name) =>
  `"src" attribute was not found on <${name} /> elemnent.\nUsing default…`;

/**
 * Contract for Reporter classes.
 * @extends HTMLElement
 */
export default class Reporter extends HTMLElement {
  static get observedAttributes() {
    return ["src"];
  }

  set src(value) {
    this._src = value;
    this.setAttribute("src", value);
  }

  get src() {
    return this._src;
  }

  constructor() {
    super();
    if (new.target === Reporter) {
      throw new Error("Cannot instantiate abstract Reporter class directly.");
    }
    this._src = this.getAttribute("src");
    if (!this._src) console.warn(warning`${this.localName}`);
    this.refresh = this.refresh.bind(this);
  }

  /**
   * Renders data to the DOM.
   * This method should be overridden in the subclass.
   * @param {Object} data
   */
  /* eslint-disable no-unused-vars */
  async render(data = {}) {
    throw new Error("Method 'render' should be overridden in subclass.");
  }

  /**
   * Refreshes the data and re-renders the component.
   */
  async refresh() {
    try {
      const api = new Api(this.src);
      const data = await api.getData();
      this.render(data);
      console.log(`Refreshing ${this.constructor.name}…`);
    } catch (error) {
      console.error(`Error in ${this.constructor.name} class:`, error);
      await this.render(null);
    }
  }

  async connectedCallback() {
    document.addEventListener(eventName, this.refresh);

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => this.refresh(), { timeout: 2000 });
    } else {
      setTimeout(() => this.refresh(), 1000);
    }
  }

  disconnectedCallback() {
    document.removeEventListener(eventName, this.refresh);
  }
}
