/**
 * @file dumpToScreen.js
 * Logs string messages to the screen.
 */
import Logger from "../_contracts/logger";
import Fifo from "./fifo";

const maxMessageQueue = 4;

export default class DumpToScreen extends Logger {
  /**
   * @param {String} elementId
   * @param {Number} queueLength
   */
  constructor(elementId, queueLength = maxMessageQueue) {
    super();
    this.element = document.getElementById(elementId);
    if (!this.element) {
      throw new Error("Element with id '" + elementId + "' not found.");
    }
    this.messages = new Fifo(queueLength, []);
  }

  /**
   * Upates the DOM element with the last three messages.
   * @param {String} str - message to log
   */
  log(str) {
    this.messages.push(str);
    const lastThreeMessages = this.messages
      .toArray()
      .map((message) => `<p>${message}</p>`)
      .join("");
    this.element.innerHTML = lastThreeMessages;
  }
}
