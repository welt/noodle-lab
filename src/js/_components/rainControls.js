export default class RainControls {
  constructor() {
    this.rain = null;
    this.playBtn = null;
    this.mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.onPreferenceChange = this.#handlePrefersReducedMotionChange.bind(this);
    this.onChangeTheme = this.#handleChangeTheme.bind(this);
  }

  async init() {
    this.rain = document.getElementById("digital-rain");
    if (!this.rain) {
      console.warn("RainControls: no #digital-rain element found");
      return;
    }

    if (!customElements.get("digital-rain")) {
      await customElements.whenDefined("digital-rain");
      this.rain = document.getElementById("digital-rain");
    }

    this.playBtn = this.rain.querySelector(".play-toggle");

    this.#bindEvents();
    this.#handlePrefersReducedMotionChange({ matches: this.mq.matches });

    const storedMode = localStorage.getItem("mode");
    const isDark =
      document.documentElement.classList.contains("dark-mode") ||
      storedMode === "dark";
    this.rain.setAttribute("theme", isDark ? "matrix" : "helvetica");
  }

  #bindEvents() {
    this.mq.addEventListener("change", this.onPreferenceChange);
    if (this.playBtn) {
      this.rain.addEventListener(
        "play",
        () => (this.playBtn.textContent = "Pause"),
      );
      this.rain.addEventListener(
        "pause",
        () => (this.playBtn.textContent = "Play"),
      );
      this.playBtn.addEventListener("click", async () => {
        if (this.rain.playing) this.rain.pause();
        else {
          try {
            await this.rain.play();
          } catch (err) {
            console.error("Play failed", err);
          }
        }
      });
    }
    document.addEventListener("toggle-button", this.onChangeTheme);
  }

  #handleChangeTheme(event) {
    this.rain.setAttribute(
      "theme",
      event.target.checked ? "matrix" : "helvetica",
    );
  }

  #handlePrefersReducedMotionChange(event) {
    const reduced = event?.matches ?? this.mq.matches;
    if (reduced) {
      console.log(
        "Reduced motion preference detected: animation will not autostart...",
      );
      this.rain.removeAttribute("autoplay");
      this.playBtn.textContent = "Play";
      if (this.rain.playing) this.rain.pause();
    } else {
      this.rain.setAttribute("autoplay", "");
      this.playBtn.textContent = "Pause";
    }
  }

  cleanup() {
    this.mq.removeEventListener("change", this.onPreferenceChange);
  }
}
