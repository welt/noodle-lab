/**
 * @file imageSwap.js
 * project-themed image swap
 */

export default class ImageSwap extends HTMLElement {
  #imageOriginalSrc;
  #imageAltSrc;
  #boundHandler;

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
    this.#boundHandler = null;
  }

  static get observedAttributes() {
    return ["src"];
  }

  connectedCallback() {
    const img = this.querySelector("img");
    if (img) this.#imageOriginalSrc = img.src;
    this.#imageAltSrc = this.getAttribute("src") || "";
    this.#boundHandler = this.#handleEvent.bind(this);
    document.addEventListener("toggle-button", this.#boundHandler);
    this.#updateDisplayedImage();
  }

  #handleEvent(event) {
    if (!event || event.type !== "toggle-button") return;
    const hasDetail = Object.hasOwn(event?.detail ?? {}, "checked");
    if (hasDetail) {
      const theme = Boolean(event.detail.checked) ? "matrix" : "helvetica";
      this.#updateDisplayedImage(theme);
      return;
    }
    this.#updateDisplayedImage();
  }

  #getTheme() {
    const isDark = document.documentElement.classList.contains("dark-mode");
    const storedMode = localStorage.getItem("mode");
    const computedDark = isDark || storedMode === "dark";
    return computedDark ? "matrix" : "helvetica";
  }

  attributeChangedCallback(attributeName, _oldValue, _newValue) {
    if (attributeName !== "src") return;
    if (attributeName === "src") {
      this.#imageAltSrc = this.getAttribute("src") || "";
      this.#updateDisplayedImage();
      return;
    }
  }

  #updateDisplayedImage(themeOverride) {
    const originalImg = this.querySelector("img");
    if (!originalImg) return;
    const theme = themeOverride || this.#getTheme();
    const src = theme === "matrix" ? this.#imageAltSrc : this.#imageOriginalSrc;
    if (!src) return;
    if (originalImg.src === src) return;
    const img = new Image();
    img.onload = () => {
      originalImg.src = src;
    };
    img.src = src;
  }

  disconnectedCallback() {
    if (this.#boundHandler) {
      document.removeEventListener("toggle-button", this.#boundHandler);
      this.#boundHandler = null;
    }
  }
}
