/**
 * @file matrixPrinter.js
 * Teletype printing effect
 */
import Printer from "../_contracts/printer";

const TIME_BETWEEN_CHARS_MS = 50;
const WORKER_PATH = "workers/worker.matrix-printer.js";

class MatrixPrinterError extends Error {
  constructor(message = "Matrix Printer error", details = {}) {
    super(message);
    this.name = "MatrixPrinterError";
    this.details = details;
  }
}

export default class MatrixPrinter extends Printer {
  #worker;
  #runId;
  #currentPromise;
  #currentResolve;
  #currentReject;
  #currentCallback;

  constructor(delay = TIME_BETWEEN_CHARS_MS) {
    super();
    this.delay = delay;
    this.#runId = 0;
    this.#currentPromise = null;
    this.#currentResolve = null;
    this.#currentReject = null;
    this.#initWorker();
  }

  #initWorker() {
    try {
      this.#worker = new Worker(WORKER_PATH);
      this.#worker.onmessage = this.#handleWorkerMessage.bind(this);
      this.#worker.onerror = this.#handleWorkerError.bind(this);
    } catch (err) {
      console.error("Failed to initialize MatrixPrinter worker:", err);
    }
  }

  #handleWorkerMessage(event) {
    const { type, text, runId } = event.data;

    // Ignore messages from old runs
    if (runId !== this.#runId) return;

    const handlers = {
      update: () => {
        this.#currentCallback?.(text);
      },
      done: () => {
        this.#currentResolve?.(text);
        this.#cleanup();
      },
      error: () => {
        this.#currentReject?.(new MatrixPrinterError(event.data.message));
        this.#cleanup();
      },
    };

    handlers[type]?.();
  }

  #cleanup() {
    this.#currentPromise = null;
    this.#currentCallback = null;
    this.#currentResolve = null;
    this.#currentReject = null;
  }

  #handleWorkerError(error) {
    console.error("MatrixPrinter worker error:", error);
    this.#currentReject?.(error);
    this.#currentPromise = null;
  }

  async print(message, callback) {
    message = message == null ? "" : String(message);

    this.#runId = this.#runId + 1;
    const runId = this.#runId;

    if (this.#currentPromise) {
      this.#worker?.postMessage({ cmd: "stop" });
      this.#cleanup();
    }

    this.#currentCallback = callback;

    return new Promise((resolve, reject) => {
      this.#currentResolve = resolve;
      this.#currentReject = reject;
      this.#currentPromise = { resolve, reject };

      this.#worker?.postMessage({
        cmd: "start",
        message,
        delay: this.delay,
        runId,
      });
    });
  }

  cancel() {
    if (this.#currentPromise) {
      this.#runId = this.#runId + 1;
      this.#worker?.postMessage({ cmd: "stop" });
      this.#currentReject?.(new MatrixPrinterError("Print cancelled"));
      this.#currentPromise = null;
    }
  }

  setDelay(delay) {
    this.delay = delay;
  }
}
export { MatrixPrinter, MatrixPrinterError };
