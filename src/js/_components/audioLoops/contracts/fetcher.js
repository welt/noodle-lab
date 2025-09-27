/**
 * @file fetcher.js
 * Abstract base class for audio source fetchers.
 */
export default class Fetcher {
  /**
   * @param {AudioContext} audioContext - Web Audio API context
   */
  constructor(audioContext) {
    if (new.target === Fetcher) {
      throw new TypeError(
        "Cannot instantiate abstract class Fetcher directly.",
      );
    }
  }

  /**
   * Fetches and decodes an audio file from given URL.
   * Subclasses must implement this method.
   * @param {string} url
   * @returns {Promise<AudioBuffer>}
   */
  async fetch(url) {
    throw new Error("fetch(url) must be implemented by subclass.");
  }

  /**
   * Clears cache for a specific URL or all.
   * Subclasses must implement this method.
   * @param {string} [url]
   * @returns void
   */
  clearCache(url) {
    throw new Error("clearCache(url) must be implemented by subclass.");
  }
}
