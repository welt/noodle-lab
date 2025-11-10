export default class DownloadControl {
  // Private fields
  #host;
  #filename = "digital-rain.png";
  #link = null;
  #boundClick;
  #boundHostPause;
  #boundHostPlay;
  #processing = false;

  constructor(hostElement) {
    if (!hostElement)
      throw new Error("DownloadControl requires a host element");
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

    const btn = document.createElement("button");
    btn.classList.add("download-toggle", "button");
    btn.setAttribute("slot", "controls");
    btn.setAttribute("role", "button");
    btn.disabled = true;
    btn.textContent = "Save";
    btn.style.pointerEvents = "auto";
    btn.addEventListener("click", this.#boundClick);
    this.#link = btn;
    this.#host.appendChild(btn);
  }

  #enableLink() {
    if (!this.#link) return;
    this.#link.disabled = false;
  }

  #disableLink() {
    if (!this.#link) return;
    this.#link.disabled = true;
  }

  async #onHostPause() {
    this.#enableLink();
  }

  #onHostPlay() {
    this.#disableLink();
  }

  async #onClick(ev) {
    if (!this.#link) return;
    const disabled = this.#link.disabled === true;
    if (disabled) {
      ev.preventDefault();
      return;
    }

    if (this.#processing) {
      ev.preventDefault();
      return;
    }
    this.#processing = true;
    ev.preventDefault();

    try {
      const blob = await this.#captureCanvasBlob();
      if (!blob) return;

      const file = new File([blob], this.#filename, { type: "image/png" });

      const canShareFiles =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFiles) {
        try {
          await navigator.share({
            files: [file],
            title: "Digital Rain",
            text: "Snapshot from Digital Rain",
          });
          return;
        } catch (shareErr) {
          // Sharing failed or user cancelled — fall through to fallback behavior.
          // eslint-disable-next-line no-console
          console.warn(
            "Share failed or aborted, falling back to download",
            shareErr,
          );
        } finally {
          // clear processing only after potential fallback executed or returned
        }
      } else if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        // Some browsers expose navigator.share but don't implement navigator.canShare,
        // try to share and catch errors (may fail if files are not supported).
        try {
          await navigator.share({
            files: [file],
            title: "Digital Rain",
            text: "Snapshot from Digital Rain",
          });
          return;
        } catch (shareErr) {
          // Might fail if files aren't supported — fall back
          // eslint-disable-next-line no-console
          console.warn(
            "navigator.share failed for files — falling back",
            shareErr,
          );
        }
      }

      const url = URL.createObjectURL(blob);

      if ("download" in HTMLAnchorElement.prototype) {
        const tmp = document.createElement("a");
        tmp.style.display = "none";
        tmp.href = url;
        tmp.download = this.#filename;
        document.body.appendChild(tmp);
        tmp.click();
        tmp.remove();
      } else {
        window.open(url, "_blank", "noopener");
      }

      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        "DownloadControl: failed to capture/share/download canvas",
        err,
      );
    } finally {
      this.#processing = false;
    }
  }

  #captureCanvasBlob() {
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

    return new Promise((resolve) => {
      try {
        canvas.toBlob(
          (blob) => {
            resolve(blob || null);
          },
          "image/png",
          1,
        );
      } catch (err) {
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
