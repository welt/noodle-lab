/**
 * errors.js
 */
export class WizardStoreError extends Error {
  constructor(message) {
    super(message);
    this.name = "WizardStoreError";
  }
}
