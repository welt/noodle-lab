import RGBA from "./rgba";
import colours from "./colours";

export default class Theme {
  static from(key = "matrix") {
    const theme = colours[key];
    if (!theme) throw new TypeError(`unknown theme key: ${String(key)}`);
    return Object.freeze({
      head: RGBA.from(theme.head),
      trail: RGBA.from(theme.trail),
      bg: RGBA.from(theme.bg),
    });
  }
}
