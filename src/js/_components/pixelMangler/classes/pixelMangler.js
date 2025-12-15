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
  #boundTriggerHandler = this.#handleTriggerEvent.bind(this);
  #triggerEventName;

  async connectedCallback() {
    const img = this.#findImage();
    if (!img) {
      console.warn("PixelMangler: destructible image not found");
      return;
    }

    if (!this.shadowRoot) {
      this.#attachShadow();
    }

    this.#triggerEventName = this.getAttribute("trigger");

    try {
      await this.#initialiseController(img, !this.#triggerEventName);
      document.addEventListener("toggle-button", this.#boundHandler);
      
      if (this.#triggerEventName) {
        document.addEventListener(
          this.#triggerEventName,
          this.#boundTriggerHandler,
        );
      }
    } catch (err) {
      this.#handleError(err);
    }
  }

  #attachShadow() {
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

  async #handleTriggerEvent(event) {
    if (!this.#triggerEventName || event.type !== this.#triggerEventName) return;

    document.removeEventListener(
      this.#triggerEventName,
      this.#boundTriggerHandler,
    );

    const theme = this.#getFallbackTheme();
    this.#controller.getAndSendData({
      ...PROCESSING_DEFAULTS,
      colourMode: theme,
    });
  }

  #handleError(err) {
    if (err instanceof WorkerError) {
      console.warn(`PixelMangler: ${err.message}`);
    } else {
      console.error("PixelMangler: initialization failed", err);
    }
  }

  async #initialiseController(img, shouldProcess = true) {
    const canvas = this.shadowRoot.querySelector("canvas");
    if (!canvas) {
      throw new WorkerError("pixel mangling needs a canvas in shadow DOM");
    }

    this.#controller = new ImageProcessor(canvas, img, WORKER_PATH);
    this.#controller.init();
    
    await this.#waitForImage(img);
    await this.#controller.drawImage();

    if (shouldProcess) {
      this.#startProcessing();
    }
  }

  async #waitForImage(img) {
    const parent = img.parentElement;
    
    if (parent?.tagName === 'IMAGE-SWAP' && parent.loaded) {
      if (parent.loaded instanceof Promise) await parent.loaded;
      return;
    }
    
    if (img.complete && img.naturalWidth !== 0) {
      return;
    }
    
    return new Promise((resolve) => {
      img.addEventListener('load', resolve, { once: true });
    });
  }

  async #handleEvent(event) {
    if (!event || event.type !== "toggle-button" || !this.#controller) return;
    
    const img = this.#findImage();
    await this.#waitForImage(img);
    await this.#controller.drawImage();
    
    const theme = this.#findTheme(event);
    this.#controller.getAndSendData({
      ...PROCESSING_DEFAULTS,
      colourMode: theme,
    });
  }

  #startProcessing() {
    const theme = this.#getFallbackTheme();
    this.#controller.getAndSendData({
      ...PROCESSING_DEFAULTS,
      colourMode: theme,
    });
  }

  #findImage() {
    return this.querySelector("img");
  }

  #findTheme(event) {
    const checked = event?.detail?.checked;
    return checked !== undefined 
      ? (checked ? "dark" : "light")
      : this.#getFallbackTheme();
  }

  #getFallbackTheme() {
    const isDark = document.documentElement.classList.contains("dark-mode");
    const storedMode = localStorage.getItem("mode");
    return (isDark || storedMode === "dark") ? "dark" : "light";
  }

  disconnectedCallback() {
    document.removeEventListener("toggle-button", this.#boundHandler);
    if (this.#triggerEventName) {
      document.removeEventListener(
        this.#triggerEventName,
        this.#boundTriggerHandler,
      );
    }
    this.#controller = null;
  }
}
