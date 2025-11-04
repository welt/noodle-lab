export default class DownloadControl {
  // Private fields
  #host;
  #link = null;
  #boundClick;
  #boundHostPause;
  #boundHostPlay;
  #filename = "digital-rain.png";

  constructor(hostElement) {
    if (!hostElement) throw new Error("DownloadControl requires a host element");
    this.#host = hostElement;

    // Bind handlers once so they can be removed later
    this.#boundClick = this.#onClick.bind(this);
    this.#boundHostPause = this.#onHostPause.bind(this);
    this.#boundHostPlay = this.#onHostPlay.bind(this);
  }

  async init() {
    this.#createLink();

    // Listen for host play/pause so we can enable/disable the control
    this.#host.addEventListener("pause", this.#boundHostPause);
    this.#host.addEventListener("play", this.#boundHostPlay);

    // Set initial state according to whether host is running
    if (this.#host.playing) this.#disableLink();
    else this.#enableLink();
  }

  #createLink() {
    if (this.#link) return;

    const a = document.createElement("a");
    a.className = "download-toggle";
    a.setAttribute("slot", "controls");
    a.setAttribute("role", "button");
    a.setAttribute("aria-disabled", "true");
    a.textContent = "Save";
    a.style.pointerEvents = "auto";

    a.addEventListener("click", this.#boundClick);

    this.#link = a;
    // Append to host so it gets slotted into <digital-rain>'s controls slot
    this.#host.appendChild(a);
  }

  #enableLink() {
    if (!this.#link) return;
    this.#link.setAttribute("aria-disabled", "false");
    // No href/download set here — actual capture/download happens on explicit click
    this.#link.removeAttribute("href");
    this.#link.removeAttribute("download");
    this.#link.removeAttribute("target");
  }

  #disableLink() {
    if (!this.#link) return;
    this.#link.setAttribute("aria-disabled", "true");
    this.#link.removeAttribute("href");
    this.#link.removeAttribute("download");
    this.#link.removeAttribute("target");
  }

  async #onHostPause() {
    // Host paused -> enable the control (but do NOT capture yet)
    this.#enableLink();
  }

  #onHostPlay() {
    // Host playing -> disable the control
    this.#disableLink();
  }

  async #onClick(ev) {
    if (!this.#link) return;
    const disabled = this.#link.getAttribute("aria-disabled") === "true";

    // If disabled, ignore clicks
    if (disabled) {
      ev.preventDefault();
      return;
    }

    // User explicitly clicked while paused -> capture + invoke download.
    ev.preventDefault();

    try {
      const blob = await this.#captureCanvasBlob();
      if (!blob) return;

      const url = URL.createObjectURL(blob);

      // For browsers that support the download attribute we create a temporary anchor
      // and click it. For browsers that don't (older iOS Safari), fallback to opening
      // the image in a new tab so the user can long-press to save.
      if ("download" in HTMLAnchorElement.prototype) {
        const tmp = document.createElement("a");
        tmp.style.display = "none";
        tmp.href = url;
        tmp.download = this.#filename;
        document.body.appendChild(tmp);
        tmp.click();
        tmp.remove();
      } else {
        // fallback
        window.open(url, "_blank", "noopener");
      }

      // Revoke after a short delay so the browser had time to consume it.
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err) {
      // Log for diagnostics; do not throw
      // eslint-disable-next-line no-console
      console.error("DownloadControl: failed to capture/download canvas", err);
    }
  }

  #captureCanvasBlob() {
    // Access the host's open shadowRoot to find the canvas.
    const sr = this.#host?.shadowRoot;
    if (!sr) {
      console.warn("DownloadControl: host has no shadowRoot");
      return Promise.resolve(null);
    }
    const canvas = sr.querySelector("canvas");
    if (!canvas) {
      console.warn("DownloadControl: canvas not found in host shadowRoot");
      return Promise.resolve(null);
    }

    // Use toBlob (async) — more memory friendly than toDataURL.
    return new Promise((resolve) => {
      try {
        canvas.toBlob((blob) => {
          resolve(blob || null);
        }, "image/png", 1);
      } catch (err) {
        // Some platforms may throw; surface as null
        // eslint-disable-next-line no-console
        console.error("DownloadControl: canvas.toBlob failed", err);
        resolve(null);
      }
    });
  }

  cleanup() {
    if (this.#host) {
      this.#host.removeEventListener("pause", this.#boundHostPause);
      this.#host.removeEventListener("play", this.#boundHostPlay);
    }
    if (this.#link) {
      this.#link.removeEventListener("click", this.#boundClick);
      if (this.#link.parentNode) this.#link.parentNode.removeChild(this.#link);
      this.#link = null;
    }
  }
}
