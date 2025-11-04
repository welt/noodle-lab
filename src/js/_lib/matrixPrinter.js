/**
 * @file matrixPrinter.js
 * Teletype printing effect
 */
import Printer from "../_contracts/printer";

const TIME_BETWEEN_CHARS_MS = 50;
const RESTART_DELAY_MS = 20; // !! kludge: delay between abort and restart

class MatrixPrinterError extends Error {
  constructor(message = "Matrix Printer error", details = {}) {
    super(message);
    this.name = "MatrixPrinterError";
    this.details = details;
  }
}

const sleep = (ms, signal) => {
  if (!signal) return;
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      if (signal) signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(t);
      signal.removeEventListener("abort", onAbort);
      reject(new MatrixPrinterError("Print cancelled"));
    };
    if (signal.aborted) {
      clearTimeout(t);
      return reject(new MatrixPrinterError("Print cancelled"));
    }
    signal.addEventListener("abort", onAbort);
  });
};

export default class MatrixPrinter extends Printer {
  #abortController;
  #lastMessage;

  constructor(delay = TIME_BETWEEN_CHARS_MS) {
    super();
    this.delay = delay;
    this.#abortController = null;
    this.#lastMessage = null;
  }

  /**
   * Yields accumulated string for teletype effect
   * @param {string} message
   */
  static *incrementalCharacters(message) {
    let acc = "";
    for (const char of message) {
      acc += char;
      yield acc;
    }
  }

  async print(message, callback) {
    message = message == null ? "" : String(message);

    // Only abort if the new message is different
    if (this.#abortController) {
      if (this.#lastMessage === message) return;
      this.#abortController.abort();
      this.#abortController = null;
      await new Promise((res) => setTimeout(res, RESTART_DELAY_MS));
    }

    this.#lastMessage = message;
    const abortController = new AbortController();
    this.#abortController = abortController;

    try {
      for (const partial of MatrixPrinter.incrementalCharacters(message)) {
        if (typeof callback === "function") callback(partial);
        await sleep(this.delay, abortController.signal);
      }
      return message;
    } finally {
      if (this.#abortController === abortController) {
        this.#abortController = null;
        this.#lastMessage = null;
      }
    }
  }

  cancel() {
    if (this.#abortController) {
      this.#abortController.abort();
      this.#abortController = null;
      this.#lastMessage = null;
    }
  }

  setDelay(delay) {
    this.delay = delay;
  }
}
