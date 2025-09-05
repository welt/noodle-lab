/**
 * @file featureFacadeContract.js
 * Contract for feature facades.
 */
export default class facadeContract {
  constructor() {
    if (new.target === facadeContract) {
      throw new TypeError(
        "Cannot instantiate abstract class FeatureFacade directly.",
      );
    }
  }

  /**
   * Initialise the feature facade.
   */
  init() {
    throw new Error("Method 'register()' must be implemented by subclass.");
  }
}
