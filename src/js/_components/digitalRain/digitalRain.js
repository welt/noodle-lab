/**
 * @file digitalRain.js
 * Matrix Rain effect
 */

export default class DigitalRain extends HTMLElement {
  #canvas;
  #stage;
  #renderer;
  #fontSize;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; height: 100%; position: relative; }
        canvas { width: 100%; height: 100%; display: block; position: relative; z-index: 0; }
        .overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .overlay-controls {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          pointer-events: none;
        }
        ::slotted(*) { pointer-events: auto; }
      </style>
      <canvas part="canvas"></canvas>
      <div part="overlay" class="overlay">
        <div class="overlay-controls"><slot name="controls"></slot></div>
      </div>
    `;
    this.#canvas = this.shadowRoot.querySelector("canvas");
    this.#stage = null;
    this.#renderer = null;
    this.#fontSize = 16;
  }

  static get observedAttributes() {
    return [
      "font-size",
      "speed",
      "char-interval",
      "col-spacing",
      "autoplay",
      "theme",
    ];
  }

  async connectedCallback() {
    try {
      await this.#initializeRenderer();
      if (this.hasAttribute("autoplay")) {
        this.#renderer.start();
        this.dispatchEvent(new Event("play"));
      }
      this.#renderer.setTheme(this.#getTheme());
    } catch (err) {
      console.error("[DigitalRain] Initialization failed:", err);
    }
  }

  /**
   * Dynamically import and initialize renderer dependencies
   * @private
   */
  async #initializeRenderer() {
    const [{ default: Stage }, { default: Renderer }] = await Promise.all([
      import("./classes/stage.js"),
      import("./classes/renderer.js"),
    ]);

    if (!this.#stage) this.#stage = new Stage(this.#canvas);
    if (!this.#renderer) {
      const { fontSize, speed, charInterval, colSpacing } =
        this.#readAttributes();
      this.#renderer = new Renderer({
        stage: this.#stage,
        fontSize,
        speed,
        charInterval,
        columnSpacing: colSpacing,
      });
    }
  }

  #getTheme() {
    const attrValue = this.hasAttribute("theme") && this.getAttribute("theme");
    const isDark = document.documentElement.classList.contains("dark-mode");
    const storedMode = localStorage.getItem("mode");
    const computedDark = isDark || storedMode === "dark";
    return attrValue || (computedDark ? "matrix" : "helvetica");
  }

  attributeChangedCallback(name, _oldValue, _newValue) {
    if (!this.#renderer || !this.#stage) return;
    const canvasHeight = this.#canvas.clientHeight;
    if (!canvasHeight) console.warn("digital-rain: canvas has zero height");
    const { fontSize, speed, charInterval, colSpacing } =
      this.#readAttributes();
    this.#renderer.setSpeed(speed);
    this.#renderer.setCharInterval(charInterval);
    this.#renderer.setFontSize(fontSize);
    this.#renderer.setColumnSpacing(colSpacing);
    if (name === "autoplay") {
      if (this.hasAttribute("autoplay") && !this.playing) {
        this.play().catch(() => {});
      }
      return;
    }
    if (name === "theme") {
      this.#renderer.setTheme(this.getAttribute("theme"));
      return;
    }
  }

  disconnectedCallback() {
    if (this.#renderer) {
      this.#renderer.destroy();
      this.#renderer = null;
    }
    if (this.#stage) {
      this.#stage.destroy();
      this.#stage = null;
    }
  }

  #readAttributes() {
    const fontSize =
      parseInt(this.getAttribute("font-size") || "", 10) || this.#fontSize;
    const speedRaw = parseFloat(this.getAttribute("speed") || "");
    const speed = Number.isFinite(speedRaw) ? speedRaw : 20;
    const charIntervalRaw = parseFloat(
      this.getAttribute("char-interval") || "",
    );
    const charInterval = Number.isFinite(charIntervalRaw)
      ? charIntervalRaw
      : null;
    const colSpacingRaw = parseFloat(this.getAttribute("col-spacing") || "");
    const colSpacing = Number.isFinite(colSpacingRaw) ? colSpacingRaw : 1;
    return { fontSize, speed, charInterval, colSpacing };
  }

  get playing() {
    return !!(this.#renderer && this.#renderer.isRunning);
  }

  async #initRenderer() {
    await this.#initializeRenderer();
  }

  play() {
    if (!this.#renderer) {
      return this.#initRenderer()
        .then(() => {
          this.#renderer.start();
          this.dispatchEvent(new Event("play"));
        })
        .catch((err) => Promise.reject(err));
    }
    if (this.playing) return Promise.resolve();
    try {
      this.#renderer.start();
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  pause() {
    if (!this.#renderer) return;
    if (!this.playing) return;
    this.#renderer.stop();
    this.dispatchEvent(new Event("pause"));
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play().catch(() => {});
  }
}
