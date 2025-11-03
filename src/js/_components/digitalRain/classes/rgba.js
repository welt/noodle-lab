/**
 * @file rgba.js
 * RGBA helper object.
 */
export default class RGBA {
  constructor(r, g, b, a = 1) {
    Object.assign(this, { r, g, b, a });
  }

  static from(colour) {
    if (colour instanceof RGBA) return v;
    if (Array.isArray(colour)) {
      const [r, g, b, a = 1] = colour;
      return new RGBA(r, g, b, a);
    }
    if (colour && typeof colour === "object") {
      const { r, g, b, a = 1 } = colour;
      return new RGBA(r, g, b, a);
    }
    throw new TypeError("unsupported colour");
  }

  toString(precision = 3) {
    const a = Number(this.a.toFixed(precision));
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${a})`;
  }

  alpha(a) {
    return new RGBA(this.r, this.g, this.b, a);
  }
}
