/**
 * @file audioLoopsController.js
 * Controller for audio loops functionality.
 */
import { AudioLoopsControllerError } from "./errors";

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
      url: "/media/carillon-kultur-welt.mp3",
    },
    tipi: {
      buffer: null,
      source: null,
      startTime: 0,
      pauseTime: 0,
      isPlaying: false,
      url: "/media/tipi_am_kanzleramt.mp3",
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
   * Play a named source
   * @param {string} name - name of the source to play
   * @returns {Promise<void>}
   * @throws {AudioLoopsControllerError} If source is unknown or already playing.
   */
  async play(name = "carillon") {
    const s = this.#sources[name];
    if (!s) throw new AudioLoopsControllerError(`Unknown source: ${name}`);

    if (s.isPlaying) return;

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
  pause(name = "carillon") {
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
  resume(name = "carillon") {
    const s = this.#sources[name];
    if (!s || s.isPlaying || !s.buffer || s.pauseTime === 0) return;
    this.play(name);
  }

  /**
   * Stop a named source
   * @param {string} name
   * @returns void
   */
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
  }

  /**
   * Pause the currently playing loop.
   * @param {string} name
   * @returns void
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
