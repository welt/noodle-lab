/**
 * @file audioController.js
 * Audio controller.
 */
import { AudioControllerError } from "../errors";

export default class AudioController {
  #context;
  #fetcher;

  #sources = {
    seaside: {
      buffer: null,
      source: null,
      startTime: 0,
      pauseTime: null,
      isPlaying: false,
      url: "/media/seaside/sandgrounder-restaurant.mp3",
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
    return this.#fetcher.fetch(url);
  }

  /**
   * Play a named source
   * @param {string} name - name of the source to play
   * @returns {Promise<void>}
   * @throws {AudioControllerError} If source is unknown or already playing.
   */
  async play(name = "seaside") {
    const s = this.#sources[name];
    if (!s) throw new AudioControllerError(`Unknown source: ${name}`);

    if (s.isPlaying) return;

    if (!s.buffer) {
      s.buffer = await this.#loadLoop(s.url);
    }
    const offset = s.pauseTime || 0;
    const source = this.#context.createBufferSource();
    source.buffer = s.buffer;
    source.loop = true;
    source.connect(this.#context.destination);
    source.start(0, offset);
    s.source = source;
    s.startTime = this.#context.currentTime - offset;
    s.isPlaying = true;

    source.onended = () => {
      s.isPlaying = false;
      s.source = null;
    };
  }

  get context() {
    return this.#context;
  }

  get sources() {
    return this.#sources;
  }

  /**
   * Pause a named source
   * @param {string} name
   * @returns void
   */
  pause(name = "seaside") {
    const s = this.#sources[name];
    if (!s || !s.isPlaying || !s.source) return;
    s.pauseTime = this.#context.currentTime - s.startTime;
    s.source.stop();
    s.isPlaying = false;
    s.source = null;
  }

  /**
   * Resume a named source
   * @param {string} name
   * @returns void
   */
  resume(name = "seaside") {
    const s = this.#sources[name];
    if (!s || s.isPlaying || !s.buffer || s.pauseTime === 0) return;
    this.play(name);
  }

  /**
   * Get the current state of a named source.
   * @param {string} name
   * @returns void
   */
  getState(name = "seaside") {
    const s = this.#sources[name];
    if (!s) return null;
    return {
      isPlaying: s.isPlaying,
      pauseTime: s.pauseTime,
      url: s.url,
    };
  }
}
