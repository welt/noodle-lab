/**
 * @file dumpToScreen.js
 * Logs string messages to the screen.
 */
import Logger from "../_contracts/logger";
import Fifo from "./fifo";

const MAX_MESSAGE_QUEUE = 4;

class LoggerError extends Error {
  constructor(message) {
    super(message);
    this.name = "LoggerError";
  }
}

export default class DumpToScreen extends Logger {
  constructor(elementId, queueLength = MAX_MESSAGE_QUEUE) {
    super();
    this.elementId = elementId;
    this.messages = new Fifo(queueLength);
    this.element = document.getElementById(this.elementId);
    if (!this.element) {
      throw new LoggerError(`Element with id '${this.elementId}' not found.`);
    }
  }

  log(str) {
    if (!this.element) {
      this.element = document.getElementById(this.elementId);
      if (!this.element) {
        throw new LoggerError(`Element with id '${this.elementId}' not found.`);
      }
    }
    this.#updatePanel(str);
  }

  #updatePanel(str) {
    this.messages.push(str);
    const latest = this.messages
      .toArray()
      .map((message) => `<p>${message}</p>`)
      .join("");
    this.element.innerHTML = latest;
  }
}
