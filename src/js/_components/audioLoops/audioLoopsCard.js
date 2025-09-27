/**
 * @file audioLoopsCard.js
 * Audio Loops card custom element
 */
const styles = ["audio-loops-card", "card", "grid-item"];

export default class AudioLoopsCard extends HTMLElement {
  #controller;

  connectedCallback() {
    this.classList.add(...styles);
    this.render();
    this.addEventListener("click", this.handleDelegatedClick.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleDelegatedClick.bind(this));
  }

  callController(action, ...args) {
    if (this.#controller) {
      return this.#controller[action](...args);
    }
    console.warn(`[AudioLoopsCard] Controller not set, action: ${action}`);
  }

  async handleDelegatedClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.getAttribute("data-action");
    const source = button.getAttribute("data-source");
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
          label = "Pause";
          ariaPressed = "true";
        }

        btn.textContent = label;
        btn.setAttribute("aria-pressed", ariaPressed);
      },
      stop: (btn, src) => {
        this.callController("stop", src);
        const toggleBtn = this.querySelector(
          `button[data-action="togglePlay"][data-source="${src}"]`,
        );
        if (toggleBtn) {
          toggleBtn.textContent = "Play";
          toggleBtn.setAttribute("aria-pressed", "false");
        }
      },
    };

    if (actions[action]) {
      await actions[action].call(this, button, source);
    }
  }

  render() {
    this.innerHTML = `
      <style>
        .audio-loops-card fieldset * + * { margin-top: 1rem; }
        .audio-loops-card fieldset {
          align-items: center;
          background-color: Gainsboro;
          border-radius: 8px;
          border: 2px solid Black;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: .5rem;
        }
        .audio-loops-card .button {
          background-color: Whitesmoke;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .audio-loops-card legend {
          background-color: Whitesmoke;
          border-radius: 6px;
          padding-left: 0.3rem;
          padding-right: 0.3rem;
        }
      </style>
      <h3>Loops aus dem Carillon im Haus der Kulturen der Welt</h3>
      <fieldset>
        <legend>KulturWelt</legend>
      <button
        class="button"
        data-action="togglePlay"
        data-source="carillon"
        aria-pressed="false">Play</button>
      <button
        class="button"
        data-action="stop"
        data-source="carillon">Stop</button>
      </fieldset>

      <fieldset>
        <legend>NachHause</legend>
      <button
        class="button"
        data-action="togglePlay"
        data-source="tipi"
        aria-pressed="false">Play</button>
      <button
        class="button"
        data-action="stop"
        data-source="tipi">Stop</button>
      </fieldset>
    `;
  }

  setController(controller) {
    this.#controller = controller;
  }
}
