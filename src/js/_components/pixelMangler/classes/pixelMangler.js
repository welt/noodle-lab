/**
 * @file pixelMangler.js
 * @dependency ImageProcessor
 * Custom element <pixel-mangler> destroys image data.
 */
import ImageProcessor from "./imageProcessor";
import { WorkerError } from "./errors";

const WORKER_PATH = "/js/pixelMangler/workers/worker.pixel-mangler.js";

const PROCESSING_DEFAULTS = {
  delay: 200,
  batchSize: 50,
};

export default class PixelMangler extends HTMLElement {
  #controller;
  #boundHandler = this.#handleEvent.bind(this);

  async connectedCallback() {
    const img = this.#findImage();
    if (!img) {
      console.warn("PixelMangler: destructible image not found");
      return;
    }
    if (!this.querySelector("canvas")) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
          :host { width: 100%; height: 100%; }
          slot { display: none; }
          canvas { aspect-ratio: auto 309 / 422; object-fit: cover; width: 100%; height: 100%; display: block; }
        </style>
        <slot></slot>
        <canvas data-mangler-canvas width="400" height="533"></canvas>
      `;
    }

    try {
      await this.#initializeController(img);
      document.addEventListener("toggle-button", this.#boundHandler);
    } catch (err) {
      if (err instanceof WorkerError) {
        console.warn(`PixelMangler: ${err.message}`);
      } else {
        console.error("PixelMangler: initialization failed", err);
      }
    }
  }

  async #initializeController(img) {
    const canvas = this.shadowRoot?.querySelector("canvas");
    if (!canvas) {
      throw new WorkerError("pixel mangling needs a canvas in shadow DOM");
    }

    this.#controller = new ImageProcessor(canvas, img, WORKER_PATH);
    this.#controller.init();

    const theme = this.#getFallbackTheme();
    this.#controller.getAndSendData({
      ...PROCESSING_DEFAULTS,
      colourMode: theme,
    });
  }

  #findImage() {
    return this.querySelector("img");
  }

  #handleEvent(event) {
    if (!event || event.type !== "toggle-button" || !this.#controller) return;
    const theme = this.#findTheme(event);
    this.#controller.getAndSendData({
      ...PROCESSING_DEFAULTS,
      colourMode: theme,
    });
  }

  #findTheme(event) {
    const checked = event?.detail?.checked;
    if (checked !== undefined) {
      return checked ? "dark" : "light";
    }
    return this.#getFallbackTheme();
  }

  #getFallbackTheme() {
    const isDark = document.documentElement.classList.contains("dark-mode");
    const storedMode = localStorage.getItem("mode");
    const computedDark = isDark || storedMode === "dark";
    return computedDark ? "dark" : "light";
  }

  disconnectedCallback() {
    try {
      document.removeEventListener("toggle-button", this.#boundHandler);
    } catch (err) {
      console.warn("PixelMangler: cleanup failed", err);
    }
  }
}
