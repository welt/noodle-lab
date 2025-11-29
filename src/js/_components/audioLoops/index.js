/**
 * @file index.js
 * Entry point for Audio Loops component
 */
import AudioLoopsCard from "./audioLoopsCard.js";

if (!customElements.get("audio-loops-card")) {
  customElements.define("audio-loops-card", AudioLoopsCard);
}

export default AudioLoopsCard;
export { AudioLoopsCard };
