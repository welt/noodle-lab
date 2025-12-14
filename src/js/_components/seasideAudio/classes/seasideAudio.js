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
    if (this.#controlsSlot && !this.__seaside_slot_listening) {
      this.#controlsSlot.addEventListener('click', this.#boundHandler);
      this.__seaside_slot_listening = true;
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
    if (this.#controller && typeof this.#controller[action] === 'function') {
      return this.#controller[action](...args);
    }
    console.warn(`[SeasideAudio] Controller not set or action missing: ${action}`);
  }

  async handleEvent(event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (!button.hasAttribute("data-action")) {
      try {
        await this.#initializeController();
        await this.callController("play", "seaside");
        this.#emitPlaySeasideOnce();
      } catch (err) {
        console.error("[SeasideAudio] play failed:", err);
      }
      return;
    }

    const actionButton = button.closest("button[data-action]");
    if (!actionButton) return;

    try {
      await this.#initializeController();
    } catch (err) {
      console.error("[SeasideAudio] Initialization failed:", err);
      this.innerHTML = "<p>Error loading seaside audio component</p>";
      return;
    }

    const action = actionButton.getAttribute("data-action");
    const source = actionButton.getAttribute("data-source");
    if (!action || !source) return;

    const actions = {
      togglePlay: async (btn, src) => {
        const state = this.callController("getState", src);
        let label, ariaPressed;

        if (state?.isPlaying) {
          this.callController("pause", src);
          label = "Play";
          ariaPressed = "false";
        } else if (state?.pauseTime) {
          this.callController("resume", src);
          label = "Pause";
          ariaPressed = "true";
        } else {
          await this.callController("play", src);
          this.#emitPlaySeasideOnce();
          label = "Pause";
          ariaPressed = "true";
        }

        btn.textContent = label;
        btn.setAttribute("aria-pressed", ariaPressed);
      },
    };

    if (actions[action]) {
      await actions[action].call(this, actionButton, source);
    }
    return;
  }

  #emitPlaySeasideOnce() {
    if (this.#hasEmittedPlaySeaside) return;
    this.dispatchEvent(new CustomEvent("play-seaside", { bubbles: true, composed: true }));
    this.#hasEmittedPlaySeaside = true;
  }

  disconnectedCallback() {
    if (this.#controlsSlot && this.__seaside_slot_listening) {
      this.#controlsSlot.removeEventListener('click', this.#boundHandler);
      this.#controlsSlot = null;
      this.__seaside_slot_listening = false;
    }
  }
}
