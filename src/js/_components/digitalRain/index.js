/**
 * @file index.js
 * Entry point for Digital Rain component
 */
import DigitalRain from "./digitalRain.js";

if (!customElements.get("digital-rain")) {
  customElements.define("digital-rain", DigitalRain);
}

export default DigitalRain;
export { DigitalRain };
