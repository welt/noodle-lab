/**
 * @file SeasideAudio.js
 */
export default class SeasideAudio extends HTMLElement {

  #boundHandler;
  #controlsSlot;
  #controller;
  #hasEmittedPlaySeaside = false;

  constructor() {
    super();
    this.#boundHandler = this.handleEvent.bind(this);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { width: 100%; height: 100%; position: relative; }
        .overlay {
          inset: 0;
          pointer-events: none;
          position: absolute;
          z-index: 1;
        }
        .overlay-controls {
          align-items: center;
          bottom: 1rem;
          display: flex;
          gap: 1rem;
          left: 1rem;
          pointer-events: none;
          position: absolute;
        }
        ::slotted(*) { pointer-events: auto; }
      </style>
      <slot></slot>
      <div part="overlay" class="overlay">
        <div class="overlay-controls"><slot name="controls"></slot></div>
      </div>
    `;
  }

  connectedCallback() {
    this.#controlsSlot = this.shadowRoot.querySelector('slot[name="controls"]');
    if (this.#controlsSlot) {
      this.#controlsSlot.addEventListener('click', this.#boundHandler);
    }
  }

  async #initializeController() {
    if (this.#controller) return;

    const [{ default: AudioController }, { default: AudioSourceFetcher }] =
      await Promise.all([
        import("./audioController.js"),
        import("../utils/audioSourceFetcher.js"),
      ]);

    const audioContext = new AudioContext();
    const fetcher = new AudioSourceFetcher(audioContext);
    this.#controller = new AudioController(audioContext, fetcher);
  }

  callController(action, ...args) {
    if (!this.#controller) {
      console.warn(`[SeasideAudio] Controller not set: ${action}`);
      return;
    }
    const fn = this.#controller[action];
    if (typeof fn !== 'function') {
      console.warn(`[SeasideAudio] Controller action missing: ${action}`);
      return;
    }
    return fn.apply(this.#controller, args);
  }

  async handleEvent(event) {
    const button = event.target.closest("button");
    if (!button) return;

    try {
      await this.#initializeController();
    } catch (err) {
      console.error("[SeasideAudio] Initialization failed:", err);
      this.innerHTML = "<p>Error loading seaside audio component</p>";
      return;
    }

    if (!button.hasAttribute("data-action")) {
      try {
        await this.callController("play", "seaside");
        this.#emitPlaySeasideOnce();
      } catch (err) {
        console.error("[SeasideAudio] play failed:", err);
      }
      return;
    }

    const actionButton = button.closest("button[data-action]");
    if (!actionButton) return;

    const action = actionButton.getAttribute("data-action");
    const source = actionButton.getAttribute("data-source");
    if (!action || !source) return;

    if (action === 'togglePlay') {
      const state = this.callController("getState", source) || {};
      let label = 'Play';
      let ariaPressed = 'false';

      if (state.isPlaying) {
        this.callController("pause", source);
        label = 'Play';
        ariaPressed = 'false';
      } else if (state.pauseTime) {
        this.callController("resume", source);
        label = 'Pause';
        ariaPressed = 'true';
      } else {
        await this.callController("play", source);
        this.#emitPlaySeasideOnce();
        label = 'Pause';
        ariaPressed = 'true';
      }

      actionButton.textContent = label;
      actionButton.setAttribute('aria-pressed', ariaPressed);
    }
  }

  #emitPlaySeasideOnce() {
    if (this.#hasEmittedPlaySeaside) return;
    this.dispatchEvent(new CustomEvent("play-seaside", { bubbles: true, composed: true }));
    this.#hasEmittedPlaySeaside = true;
  }

  disconnectedCallback() {
    if (this.#controlsSlot) {
      this.#controlsSlot.removeEventListener('click', this.#boundHandler);
      this.#controlsSlot = null;
    }
  }
}
