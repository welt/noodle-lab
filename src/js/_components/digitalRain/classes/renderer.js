import Charset from "./charset.js";
import Column from "./column.js";
import Stage from "./stage.js";
import Theme from "./theme.js";

const alphaClamped = (alpha) => Math.max(0, Math.min(1, +alpha));

/**
 * @typedef {Object} RendererOptions
 * @property {Stage|Function} [stage]       Existing Stage instance or constructor
 * @property {Function} [StageClass]        Stage constructor (default Stage)
 * @property {string} [canvasId='matrix']   Canvas element id
 * @property {number} [fontSize=16]         Font size in px
 * @property {number} [columnSpacing=1]     Horizontal packing ratio (1 = default, <1 = tighter)
 * @property {number} [trailAlpha=0.08]     Alpha value for trail effect
 */

export default class Renderer {
  #rafId;
  #running;
  #initialised;
  #boundLoop;
  #boundResizeHandler;
  #lastFrameTime;
  #speed;
  #charInterval;
  #columnSpacing;
  #charWidth;
  #stepX;
  #trailAlpha;
  #theme;

  #fillStyleHead;
  #fillStyleTrail;
  #bg;

  /**
   * @param {RendererOptions} [options]
   */
  constructor({
    stage = null,
    StageClass = Stage,
    canvasId = "matrix",
    fontSize = 16,
    speed = 20,
    charInterval = null,
    columnSpacing = 1,
    trailAlpha = 0.08,
  } = {}) {
    this.stage = stage || new StageClass(canvasId);
    this.ctx = this.stage.ctx;
    this.fontSize = fontSize;
    this.charset = new Charset();
    this.charStream = this.charset.randomStream();
    this.columns = [];
    this.#boundResizeHandler = this.#onResize.bind(this);
    this.stage.addEventListener("stage:resize", this.#boundResizeHandler);
    this.#boundLoop = this.#loop.bind(this);
    this.#running = false;
    this.#rafId = null;
    this.#initialised = false;
    this.#lastFrameTime = null;
    this.#speed = speed;
    this.#charInterval = charInterval;
    this.#columnSpacing = Number.isFinite(columnSpacing) ? columnSpacing : 1;
    this.#trailAlpha = Number.isFinite(trailAlpha)
      ? alphaClamped(trailAlpha)
      : 0.08;
    this.stage.setFont(this.fontSize);
    this.#theme = "helvetica";
    this.#applyTheme(this.#theme);
  }

  get isRunning() {
    return this.#running;
  }

  setSpeed(speed) {
    if (Number.isFinite(speed)) this.#speed = speed;
  }

  setFontSize(fontSize) {
    if (!Number.isFinite(fontSize) || fontSize <= 0) return;
    if (fontSize === this.fontSize) return;
    this.fontSize = fontSize;
    this.stage.setFont(this.fontSize);
    this.#setGain();
    this.#initColumns(Math.max(1, Math.floor(this.stage.width / this.#stepX)));
  }

  setCharInterval(charInterval) {
    this.#charInterval = Number.isFinite(charInterval) ? charInterval : null;
    for (const col of this.columns) {
      col.charInterval =
        this.#charInterval == null
          ? 0.05 + Math.random() * 4
          : this.#charInterval;
    }
  }

  setColumnSpacing(spacing) {
    if (!Number.isFinite(spacing) || spacing <= 0) return;
    this.#columnSpacing = spacing;
    this.#setGain();
    this.#initColumns(Math.max(1, Math.floor(this.stage.width / this.#stepX)));
  }

  #setGain() {
    this.#charWidth =
      this.stage.ctx.measureText("M").width || this.fontSize * 0.6;
    this.#stepX = Math.max(1, this.#charWidth * this.#columnSpacing);
  }

  #init() {
    if (this.#initialised) return;
    this.stage.setFont(this.fontSize);
    this.#setGain();
    this.#initColumns(Math.floor(this.stage.width / this.#stepX));
    this.#initialised = true;
  }

  #initColumns(cols) {
    const count = Math.max(1, Math.floor(cols));
    const randomStartRow = (maxOffset = 20) =>
      Math.floor(Math.random() * -maxOffset);
    const makeColumn = (_, i) =>
      new Column(
        i,
        this.fontSize,
        randomStartRow(),
        this.#charInterval,
        this.#stepX,
      );
    this.columns = Array.from({ length: count }, makeColumn);
  }

  #onResize(e) {
    this.stage.setFont(this.fontSize);
    this.#setGain();
    this.#initColumns(Math.floor(e.detail.width / this.#stepX));
  }

  #clear(alpha) {
    this.ctx.fillStyle = this.#bg.alpha(alpha).toString();
    this.ctx.fillRect(0, 0, this.stage.width, this.stage.height);
  }

  #draw(deltaRows, deltaTime) {
    this.#clear(this.#trailAlpha);
    for (const col of this.columns) {
      col.stepBy(deltaRows, deltaTime, this.stage.height);
      col.maybeUpdateChar(() => this.charStream.next().value);
      const x = Math.round(col.x);
      const y = Math.round(col.y);
      const char = col.char;

      this.ctx.fillStyle = this.#fillStyleHead;
      this.ctx.fillText(char, x, y);

      if (y - this.fontSize > 0) {
        this.ctx.fillStyle = this.#fillStyleTrail;
        this.ctx.fillText(char, x, Math.round(y - this.fontSize * 0.6));
      }
    }
  }

  #loop(timestamp) {
    if (!this.#running) return;
    if (this.#lastFrameTime == null) this.#lastFrameTime = timestamp;
    const deltaTime = Math.max(0, (timestamp - this.#lastFrameTime) / 1000);
    this.#lastFrameTime = timestamp;
    const deltaRows = deltaTime * this.#speed;
    this.#draw(deltaRows, deltaTime);
    this.#rafId = requestAnimationFrame(this.#boundLoop);
  }

  setTheme(theme) {
    this.#theme = theme;
    this.#applyTheme(theme);
  }

  #applyTheme(themeKey) {
    const theme = Theme.from(themeKey || "helvetica");
    const { head, trail, bg } = theme;
    this.#fillStyleHead = head.toString();
    this.#fillStyleTrail = trail.toString();
    this.#bg = bg;
  }

  stop() {
    this.#running = false;
    if (this.#rafId !== null) {
      cancelAnimationFrame(this.#rafId);
      this.#rafId = null;
    }
  }

  start() {
    if (this.#running) return;
    if (!this.#initialised) this.#init();
    this.#running = true;
    this.#lastFrameTime = null;
    if (this.#rafId === null)
      this.#rafId = requestAnimationFrame(this.#boundLoop);
  }

  destroy() {
    this.stop();
    if (this.#boundResizeHandler)
      this.stage.removeEventListener("stage:resize", this.#boundResizeHandler);
    this.stage.destroy();
  }
}
