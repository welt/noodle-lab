/**
 * @file audioLoopsController.js
 * Controller for audio loops functionality.
 */
import AudioLoopsCard from "./audioLoopsCard";

export default class AudioLoopsController {
  #context;
  #fetcher;

  #sources = {
    carillon: {
      buffer: null,
      source: null,
      startTime: 0,
      pauseTime: 0,
      isPlaying: false,
      url: "http://localhost:8080/media/carillon-kultur-welt.mp3",
    },
  };

  constructor(context, fetcher) {
    this.#context = context;
    this.#fetcher = fetcher;
  }

  /**
   * Loads an audio loop from a URL.
   * @param {string} url
   * @returns {Promise<AudioBuffer>}
   */
  async #loadLoop(url) {
    return await this.#fetcher.fetch(url);
  }

  /**
   * Play a named source (default: "carillon")
   * @param {string} name - Name of the source to play
   * @returns {Promise<void>}
   */
  async play(name = "carillon") {
    const s = this.#sources[name];
    if (!s) throw new Error(`Unknown source: ${name}`);
    // If already playing, do nothing
    if (s.isPlaying) return;
    // Load buffer if not loaded
    if (!s.buffer) {
      s.buffer = await this.#loadLoop(s.url);
    }
    // If resuming from pause, use pauseTime as offset
    const offset = s.pauseTime || 0;
    const source = this.#context.createBufferSource();
    source.buffer = s.buffer;
    source.loop = true;
    source.connect(this.#context.destination);
    source.start(0, offset);
    s.source = source;
    s.startTime = this.#context.currentTime - offset;
    s.isPlaying = true;
    // When playback ends (if not looping), reset state
    source.onended = () => {
      s.isPlaying = false;
      s.source = null;
    };
  }

  get context() {
    return this.#context;
  }

  // Getter for sources for testing
  get sources() {
    return this.#sources;
  }

  /**
   * Pause a named source (default: "carillon")
   * @param {string} name
   * @returns void
   */
  pause(name = "carillon") {
    const s = this.#sources[name];
    if (!s || !s.isPlaying || !s.source) return;
    s.pauseTime = this.#context.currentTime - s.startTime;
    s.source.stop();
    s.isPlaying = false;
    s.source = null;
  }

  /**
   * Resume a named source (default: "carillon")
   * @param {string} name
   * @returns void
   */
  resume(name = "carillon") {
    const s = this.#sources[name];
    if (!s || s.isPlaying || !s.buffer || s.pauseTime === 0) return;
    this.play(name);
  }

  // Stop a named source (default: "carillon")
  stop(name = "carillon") {
    const s = this.#sources[name];
    if (!s) return;
    if (s.source) {
      s.source.stop();
      s.source = null;
    }
    s.isPlaying = false;
    s.pauseTime = 0;
    s.startTime = 0;
    s.buffer = null;
  }

  /**
   * Pause the currently playing loop.
   */
  getState(name = "carillon") {
    const s = this.#sources[name];
    if (!s) return null;
    return {
      isPlaying: s.isPlaying,
      pauseTime: s.pauseTime,
      url: s.url,
    };
  }
}
