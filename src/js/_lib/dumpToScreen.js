/**
 * @file dumpToScreen.js
 * Logs string messages to the screen.
 */
import Logger from "../_contracts/logger";
import Fifo from "./fifo";
import noop from "./noop";

const maxMessageQueue = 4;

class LoggerError extends Error {
  constructor(message) {
    super(message);
    this.name = "LoggerError";
  }
}

export default class DumpToScreen extends Logger {
  constructor(elementId, queueLength = maxMessageQueue) {
    super();
    this.elementId = elementId;
    this.messages = new Fifo(queueLength);
    this.element = null;
  }

  log(str) {
    if (this.element === null) {
      this.element = document.getElementById(this.elementId);

      if (!this.element && document.readyState === "loading") {
        document.addEventListener(
          "DOMContentLoaded",
          () => {
            this.element = document.getElementById(this.elementId);
            if (this.element) {
              this.#updatePanel(str);
              return;
            }
            this.#throwNotFound();
          },
          { once: true },
        );
        return;
      }

      if (!this.element) {
        this.#throwNotFound();
        return;
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
    requestAnimationFrame(noop); // Additional redundancy: forced repaint.
  }

  #throwNotFound() {
    throw new LoggerError(`Element with id '${this.elementId}' not found.`);
  }
}
