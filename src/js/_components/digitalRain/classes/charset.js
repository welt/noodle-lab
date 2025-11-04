/**
 * @typedef {Object} CharsetOptions
 * @property {number} [start=33]    Inclusive start codepoint (e.g. 33 => '!')
 * @property {number} [end=126]     Inclusive end codepoint (e.g. 126 => '~')
 */

export default class Charset {
  #chars;

  /** @param {CharsetOptions} [options] */
  constructor({ start = 33, end = 126 } = {}) {
    this.init(start, end);
  }
  init(start, end) {
    this.#chars = Array.from({ length: end - start + 1 }, (_, i) =>
      String.fromCharCode(start + i),
    );
  }
  *randomStream(rng = () => Math.random()) {
    while (true) {
      yield this.#chars[Math.floor(rng() * this.#chars.length)];
    }
  }
}
