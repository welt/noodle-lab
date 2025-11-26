/**
 * @file pixelMangler.js
 * @dependency ImageProcessor
 * Custom element <pixel-mangler> destroys image data.
 */
import ImageProcessor from './imageProcessor';

const WORKER_PATH = "workers/worker.pixel-mangler.js";

const PROCESSING_DEFAULTS = {
  delay: 200,
  batchSize: 50
};

export default class PixelMangler extends HTMLElement {
  #boundHandler;
  #imageProcessor;

  constructor() {
    super();
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
    this.#boundHandler = this.#handleEvent.bind(this);
  }

  get canvas() {
    return this.shadowRoot.querySelector('canvas');
  }

  connectedCallback() {
    const img = this.#findImage();
    if (!img) {
      console.warn('PixelMangler: destructible image not found');
      return;
    }
    if (!this.canvas) {
      console.warn('PixelMangler: pixel mangling needs a canvas in shadow DOM');
      return;
    }
  
    const theme = this.#getFallbackTheme();

    try {
      this.#imageProcessor = new ImageProcessor(this.canvas, img, WORKER_PATH);
      this.#imageProcessor.init();
      this.#imageProcessor.getAndSendData({ 
        ...PROCESSING_DEFAULTS, 
        colorMode: theme 
      });
    } catch (err) {
      if (err instanceof WorkerError) {
        console.warn(`PixelMangler: ${err.message}`);
      } else {
        throw err;
      }
    }
    document.addEventListener("toggle-button", this.#boundHandler);
  }

  #findImage() {
    return this.querySelector('img');
  }

  #handleEvent(event) {
    if (!event || event.type !== "toggle-button") return;
    const theme = this.#findTheme(event);
    this.#imageProcessor.getAndSendData({ 
      ...PROCESSING_DEFAULTS, 
      colorMode: theme 
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
      console.warn('PixelMangler: cleanup failed', err);
    }
  }
}
