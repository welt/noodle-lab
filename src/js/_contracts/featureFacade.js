/**
 * @file featureFacade.js
 * Contract for feature facades.
 */
export default class FeatureFacade {
  constructor() {
    if (new.target === FeatureFacade) {
      throw new TypeError(
        "Cannot instantiate abstract class FeatureFacade directly.",
      );
    }
  }

  /**
   * Register custom elements and setup.
   */
  register() {
    throw new Error("Method 'register()' must be implemented by subclass.");
  }
}
