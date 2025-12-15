/**
 * @file imageSwap.js
 * project-themed image swap
 */

export default class ImageSwap extends HTMLElement {
  #imageOriginalSrc;
  #imageAltSrc;
  #boundHandler;
  #currentLoadPromise = Promise.resolve();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { width: 100%; height: 100%; position: relative; }
        ::slotted(img) {
          aspect-ratio: auto 309 / 422;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }
      </style>
      <slot></slot>
    `;
    this.#imageOriginalSrc = "";
    this.#imageAltSrc = "";
    this.#boundHandler = this.#handleEvent.bind(this);
  }

  static get observedAttributes() {
    return ["src"];
  }

  get loaded() {
    return this.#currentLoadPromise;
  }

  connectedCallback() {
    const img = this.querySelector("img");
    if (img) this.#imageOriginalSrc = img.src;
    this.#imageAltSrc = this.getAttribute("src") || "";
    document.addEventListener("toggle-button", this.#boundHandler);
    this.#updateDisplayedImage();
  }

  attributeChangedCallback(attributeName, _oldValue, _newValue) {
    if (attributeName === "src") {
      this.#imageAltSrc = this.getAttribute("src") || "";
      this.#updateDisplayedImage();
    }
  }

  #handleEvent(event) {
    if (!event || event.type !== "toggle-button") return;
    
    const hasDetail = Object.hasOwn(event?.detail ?? {}, "checked");
    const theme = hasDetail 
      ? (event.detail.checked ? "matrix" : "helvetica")
      : this.#getTheme();
    
    this.#updateDisplayedImage(theme);
  }

  #getTheme() {
    const isDark = document.documentElement.classList.contains("dark-mode");
    const storedMode = localStorage.getItem("mode");
    return (isDark || storedMode === "dark") ? "matrix" : "helvetica";
  }

  #updateDisplayedImage(themeOverride) {
    const originalImg = this.querySelector("img");
    if (!originalImg) return;
    
    const theme = themeOverride || this.#getTheme();
    const src = theme === "matrix" ? this.#imageAltSrc : this.#imageOriginalSrc;
    
    if (!src || originalImg.src === src) return;

    this.#currentLoadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        originalImg.src = src;
        resolve();
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  disconnectedCallback() {
    document.removeEventListener("toggle-button", this.#boundHandler);
  }
}
