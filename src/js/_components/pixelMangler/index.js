/**
 * @file index.js
 * @dependency app
 * @dependency PixelMangler
 * Entry point for PixelMangler component
 */
import app from './classes/app';
import PixelMangler from './classes/pixelMangler';

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    app.init();
  }
});

export default PixelMangler;
