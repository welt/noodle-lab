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
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = Math.max(0, rect.width);
    const cssHeight = Math.max(0, rect.height);

    const newDpr = window.devicePixelRatio || 1;
    const targetWidth = Math.max(1, Math.round(cssWidth * newDpr));
    const targetHeight = Math.max(1, Math.round(cssHeight * newDpr));

    const widthDiff = Math.abs(this.canvas.width - targetWidth);
    const heightDiff = Math.abs(this.canvas.height - targetHeight);
    const dprChanged = this.dpr !== newDpr;

    if (!dprChanged && widthDiff <= 1 && heightDiff <= 1) {
      this.dispatchEvent(
        new CustomEvent("stage:resize", {
          detail: {
            width: Math.floor(cssWidth),
            height: Math.floor(cssHeight),
          },
        }),
      );
      return;
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.dpr = newDpr;
    this.canvas.width = targetWidth;
    this.canvas.height = targetHeight;
    this.ctx.scale(this.dpr, this.dpr);

    this.dispatchEvent(
      new CustomEvent("stage:resize", {
        detail: { width: Math.floor(cssWidth), height: Math.floor(cssHeight) },
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
