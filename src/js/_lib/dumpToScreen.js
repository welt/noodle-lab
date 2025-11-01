/**
 * @file dumpToScreen.js
 * Logs string messages to the screen.
 */
import Logger from "../_contracts/logger";
import Fifo from "./fifo";
import MatrixPrinter from "./matrixPrinter";
import Message from "./message";

const MAX_MESSAGE_QUEUE = 4;

const shouldIgnoreError = (e) =>
  e instanceof Error &&
  e.name === "MatrixPrinterError" &&
  e.message === "Print cancelled";

class LoggerError extends Error {
  constructor(message) {
    super(message);
    this.name = "LoggerError";
  }
}

export default class DumpToScreen extends Logger {
  constructor(elementId, queueLength = MAX_MESSAGE_QUEUE, printer = null) {
    super();
    this.elementId = elementId;
    this.messages = new Fifo(queueLength);
    this.element = document.getElementById(this.elementId);
    this.printer = printer || new MatrixPrinter(20);
    this.#ensureElement(); // ?element logic is dodgy - refactor
  }

  setPrinter(printer) {
    this.printer = printer;
  }

  log(str) {
    this.#ensureElement();
    const message = Message.from(str, false);
    this.#addToQueue(message);
    this.#render();
  }

  #ensureElement() {
    if (!this.element) {
      this.element = document.getElementById(this.elementId);
      if (!this.element) {
        throw new LoggerError(`Element with id '${this.elementId}' not found.`);
      }
    }
  }

  #addToQueue(message) {
    this.messages.push(message);
    return this.messages.toArray().length - 1;
  }

  logAnimated(str) {
    this.#ensureElement();
    const message = Message.from(str, true);
    this.#addToQueue(message);
    void this.#startAnimation(message);
  }

  async #startAnimation(message) {
    if (message.animationStarted) return;
    message.animationStarted = true;
    try {
      await this.printer.print(message.messageText, (accumulated) => {
        message.currentDisplay = accumulated;
        this.#render();
      });
      message.isAnimated = false;
      message.currentDisplay = message.messageText;
      this.#render();
    } catch (e) {
      if (shouldIgnoreError(e)) return;
      console.error(e);
    }
  }

  #render() {
    const messages = this.messages.toArray();
    const latest = messages
      .map((message) => `<p>${message.currentDisplay}</p>`)
      .join("");
    this.element.innerHTML = latest;
  }
}
