/**
 * @typedef {Object} DistributionConfig
 * @property {number} totalPixels - Total number of pixels in image
 * @property {number} modifyCount - Number of pixels to modify
 * @property {number} width - Image width (required for spatial distributions)
 * @property {number} height - Image height (required for spatial distributions)
 */

/**
 * Identify modifiable pixel positions in an image,
 * based on distribution strategy.
 * @abstract
 */
class DistributionStrategy {
  #name;
  /**
   * @param {string} name - Name of distribution strategy
   */
  constructor(name) {
    this.#name = name;
  }
  get name() {
    return this.#name;
  }
  /**
   * Calculate pixel positions to modify
   * @param {DistributionConfig} config
   * @returns {number[]} Array of pixel positions to modify
   */
  generate(config) {
    throw new Error("generate() must be implemented by subclass");
  }
}

export class DistributionUniform extends DistributionStrategy {
  constructor() {
    super("uniform");
  }
  generate(config) {
    const { totalPixels, modifyCount } = config;
    const pixelPositions = Array.from({ length: totalPixels }, (_, i) => i);
    for (let i = 0; i < modifyCount; i++) {
      const j = i + Math.floor(Math.random() * (totalPixels - i));
      // Fisher-Yates shuffle
      [pixelPositions[i], pixelPositions[j]] = [
        pixelPositions[j],
        pixelPositions[i],
      ];
    }
    return pixelPositions.slice(0, modifyCount);
  }
}

export class DistributionGaussian extends DistributionStrategy {
  constructor() {
    super("gaussian");
  }
  generate(config) {
    const { totalPixels, modifyCount, width, height } = config;
    const centerX = width / 2;
    const centerY = height / 2;
    const stdDev = Math.min(width, height) / 4;

    const pixelPositions = [];
    const used = new Set();

    const gaussianX = this.gaussianRandom(centerX, stdDev);
    const gaussianY = this.gaussianRandom(centerY, stdDev);

    while (pixelPositions.length < modifyCount) {
      const x = Math.round(gaussianX.next().value);
      const y = Math.round(gaussianY.next().value);

      const clampedX = Math.max(0, Math.min(width - 1, x));
      const clampedY = Math.max(0, Math.min(height - 1, y));
      const pixIdx = clampedY * width + clampedX;

      if (!used.has(pixIdx)) {
        pixelPositions.push(pixIdx);
        used.add(pixIdx);
      }
    }
    return pixelPositions;
  }

  *gaussianRandom(mean = 0, stdDev = 1) {
    while (true) {
      let u1 = 0,
        u2 = 0;
      while (u1 === 0) u1 = Math.random();
      while (u2 === 0) u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      yield z0 * stdDev + mean;
    }
  }
}
