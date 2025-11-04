export default class Stage extends EventTarget {
  #boundResize;
  #resizeObserver;

  constructor(canvas = "matrix") {
    super();
    this.canvas =
      typeof canvas === "string" ? document.getElementById(canvas) : canvas;
    if (!this.canvas) {
      throw new Error(`Stage: canvas "${canvas}" not found`);
    }
    this.ctx = this.canvas.getContext("2d");
    this.dpr = window.devicePixelRatio || 1;

    this.#boundResize = this.#handleResize.bind(this);
    window.addEventListener("resize", this.#boundResize);

    this.#resizeObserver = new ResizeObserver(() => {
      this.#handleResize();
    });
    this.#resizeObserver.observe(this.canvas);

    this.#handleResize();
  }

  get width() {
    return Math.max(0, Math.floor(this.canvas.clientWidth));
  }

  get height() {
    return Math.max(0, Math.floor(this.canvas.clientHeight));
  }

  #handleResize() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.dpr = window.devicePixelRatio || 1;
    const cssWidth = this.width;
    const cssHeight = this.height;
    this.canvas.width = Math.max(1, Math.floor(cssWidth * this.dpr));
    this.canvas.height = Math.max(1, Math.floor(cssHeight * this.dpr));
    this.ctx.scale(this.dpr, this.dpr);
    this.dispatchEvent(
      new CustomEvent("stage:resize", {
        detail: { width: cssWidth, height: cssHeight },
      }),
    );
  }

  setFont(fontSize) {
    this.ctx.font = `${fontSize}px monospace`;
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = "left";
  }

  destroy() {
    window.removeEventListener("resize", this.#boundResize);
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
      this.#resizeObserver = null;
    }
  }
}
