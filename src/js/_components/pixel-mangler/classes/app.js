/**
 * @file app.js
 * @dependency PixelMangler
 * initialises <pixel-mangler> component
 */
import PixelMangler from './pixelMangler';

const app = {
  init() {
    if (customElements.get('pixel-mangler')) {
      return;
    }
    customElements.define('pixel-mangler', PixelMangler);
  },
}

export default app;
