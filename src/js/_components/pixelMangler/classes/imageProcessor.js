/**
 * @file imageProcessor.js
 * @dependency WorkerError
 * @dependency worker.pixel-mangler.js
 * Handles image processing in web worker.
 */
import { WorkerError } from "./errors";

/**
 * Constructor for ImageProcessor
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement} image
 * @param {string} workerPath - relative path to worker script (from host)
 * @throws {WorkerError} if worker fails to load
 * @returns {ImageProcessor}
 */
export default function ImageProcessor(canvas, image, workerPath) {
  this.canvas = canvas;
  this.image = image;
  this.imageData = null;
  try {
    this.worker = new Worker(workerPath, { type: "module" });
  } catch (err) {
    throw new WorkerError(`Failed to load worker from ${workerPath}`);
  }
}

/**
 * Initialises ImageProcessor - sets up canvas and worker
 * @throws {WorkerError} if worker is not available
 */
ImageProcessor.prototype.init = function () {
  if (!this.worker) {
    throw new WorkerError("Worker not available");
  }
  this.ctx = this.canvas.getContext("2d");
  this.worker.onmessage = this.handleWorkerMessage.bind(this);
};

/**
 * gets image data, renders it to canvas for analysis
 * then sends metadata to worker for processing
 * @param {Object} options - processing options
 * @param {number} options.delay - delay between batches in ms
 * @param {number} options.batchSize - number of pixels to process per batch
 * @param {string} options.colourMode - drak/light mode theme support
 * @throws {WorkerError} if worker is not available
 */
ImageProcessor.prototype.getAndSendData = function ({
  delay = 10,
  batchSize = 100,
  colourMode = "dark",
  strategy = "gaussian",
} = {}) {
  if (!this.worker) {
    throw new WorkerError("Cannot send image data without worker");
  }

  const image = this.image;
  const start = () => {
    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    this.imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    this.ctx.putImageData(this.imageData, 0, 0);

    this.worker.postMessage({
      width: this.canvas.width,
      height: this.canvas.height,
      delay,
      batchSize,
      colourMode,
      strategy,
    });
  };

  image.onload = start;
  if (image.complete && image.naturalWidth !== 0) start();
};

/**
 * Handles messages from worker
 * @param {MessageEvent} event - message event from worker
 * @returns {void}
 */
ImageProcessor.prototype.handleWorkerMessage = function (event) {
  const msg = event.data;
  if (!msg) return;

  const handlers = {
    start: (msg) =>
      console.log(
        `📣 PixelMangler starting job: totalPixels = ${msg.totalPixels}, modifyCount = ${msg.modifyCount}, colourMode = ${msg.colourMode}, distribution = ${msg.distribution}`,
      ),
    batch: (msg) => {
      if (!Array.isArray(msg.updates) || !this.imageData) return;
      const pixels = this.imageData.data;
      for (const u of msg.updates) {
        const i = u.index * 4;
        pixels[i] = u.r;
        pixels[i + 1] = u.g;
        pixels[i + 2] = u.b;
      }
      this.ctx.putImageData(this.imageData, 0, 0);
    },
    done: () => console.log("🐍 PixelMangler finished job"),
    imageData: (msg) => this.ctx.putImageData(msg, 0, 0),
  };

  (handlers[msg.type] || handlers.imageData)(msg);
};
