/**
 * @file AudioSourceFetcher.js
 * Util to fetch and decode audio files.
 */
import Fetcher from "../contracts/fetcher";
import AudioLoopsFetcherError from "../errors";

export default class AudioSourceFetcher extends Fetcher {
  /**
   * @param {AudioContext} audioContext - Web Audio API context
   */
  constructor(audioContext) {
    super();
    this.audioContext = audioContext;
    this.cache = new Map();
  }

  /**
   * Fetches and decodes an audio file from given URL.
   * Uses cache if available.
   * @param {string} url - URL of the audio file
   * @returns {Promise<AudioBuffer>} - decoded AudioBuffer
   * @throws {AudioLoopsFetcherError}
   */
  async fetch(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new AudioLoopsFetcherError(
          `Failed to fetch audio: ${response.status} ${response.statusText}`,
        );
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.cache.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.error(`AudioSourceFetcher error for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Clears cache for a specific URL or all.
   * @param {string} [url] - if omitted, clears all
   * @returns void
   */
  clearCache(url) {
    if (url) {
      this.cache.delete(url);
    } else {
      this.cache.clear();
    }
  }
}
