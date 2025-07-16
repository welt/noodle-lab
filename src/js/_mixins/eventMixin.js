/**
 * @file eventMixin.js
 * Trait-like functions to add event handling to an object.
 */
export default {
  /**
   * Adds event listener to an EventTarget.
   * @param {String} type - The event type to subscribe to.
   * @param {Function} callback 
   */
  subscribe: function (type, callback) {
    if (typeof this.addEventListener !== 'function') {
      throw new Error('Object does not implement EventTarget interface');
    }

    this.addEventListener(type, callback);
  },
  /**
   * Removes event listener from an EventTarget.
   * @param {String} type - The event type to unsubscribe from.
   * @param {Function} callback 
   */
  unsubscribe: function (type, callback) {
    if (typeof this.removeEventListener !== 'function') {
      throw new Error('Object does not implement EventTarget interface');
    }

    this.removeEventListener(type, callback);
  },
  /**
   * Dispatches an event from an EventTarget.
   * @param {String} type
   * @param {Object} detail
   */
  emit: function (type, detail = {}) {
    if (typeof this.dispatchEvent !== 'function') {
      throw new Error('Object does not implement EventTarget interface');
    }

    const event = new CustomEvent(`${type}`, {
      bubbles: true,
      cancelable: true,
      detail: detail,
    });

    return this.dispatchEvent(event);
  },
};
