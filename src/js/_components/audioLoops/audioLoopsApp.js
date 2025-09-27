/**
 * @file audioLoopsApp.js
 * App facade for audio loops feature.
 */
import AudioLoopsCard from "./audioLoopsCard";
import AudioLoopsController from "./audioLoopsController";
import AudioSourceFetcher from "./utils/AudioSourceFetcher";

export default class AudioLoopsApp {
  init() {
    this.defineCustomElements();
    const audioContext = new AudioContext();
    const fetcher = new AudioSourceFetcher(audioContext);
    const controller = new AudioLoopsController(audioContext, fetcher);
    const card = document.createElement("audio-loops-card");
    card.setController(controller);
    this.setUpDOM("main", card);
  }

  /**
   * Adds elements to DOM.
   * @param {string} selector
   * @param {HTMLElement} element
   * @returns void
   */
  setUpDOM(selector, element) {
    const el = document.getElementById(selector);
    if (!el) {
      console.warn(`No element with id="${selector}" found in the DOM.`);
      return;
    }
    el.appendChild(element);
  }

  defineCustomElements() {
    if (!customElements.get("audio-loops-card")) {
      customElements.define("audio-loops-card", AudioLoopsCard);
    }
  }
}
