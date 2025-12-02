/**
 * @file AudioSourceFetcher.js
 * Util to fetch and decode audio files.
 */
import Fetcher from "../contracts/fetcher";
import { AudioLoopsFetcherError } from "../errors";

export default class AudioSourceFetcher extends Fetcher {
  /**
   * @param {AudioContext} audioContext - Web Audio API context
   */
  constructor(audioContext) {
    super();
    this.audioContext = audioContext;
    this.cache = new Map();
    this.#initWorker();
  }

  #initWorker() {
    this.worker = new Worker(
      new URL(
        "/js/audioLoops/workers/worker.audio-decoder.js",
        import.meta.url,
      ),
      { type: "module" },
    );
    this.messageId = 0;
    this.pendingRequests = new Map();

    this.worker.onmessage = (event) => {
      const { id, success, error, audioBuffer } = event.data;
      const request = this.pendingRequests.get(id);
      if (!request) return;

      if (success) {
        request.resolve(audioBuffer);
      } else {
        request.reject(new AudioLoopsFetcherError(error));
      }
      this.pendingRequests.delete(id);
    };

    this.worker.onerror = (error) => {
      console.error("Worker error:", error);
    };
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

      const id = this.messageId++;
      const audioBuffer = await new Promise((resolve, reject) => {
        this.pendingRequests.set(id, { resolve, reject });
        this.worker.postMessage({ id, type: "decode", arrayBuffer }, [
          arrayBuffer,
        ]);
      });

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
