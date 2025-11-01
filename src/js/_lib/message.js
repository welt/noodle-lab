/**
 * @file message.js
 * Message object for DumpToScreen logger
 */

export default class Message {
  constructor(text, shouldAnimate = false) {
    this.messageText = text;
    this.shouldAnimate = shouldAnimate;
    this.currentDisplay = shouldAnimate ? "" : text;
    this.animationStarted = false;
  }

  /**
   * Factory method to create Message from string or Message object
   * @param {String|Message} input
   * @param {Boolean} shouldAnimate
   * @returns {Message}
   */
  static from(input, isAnimated = false) {
    if (!(input instanceof Message)) {
      return new Message(input, isAnimated);
    }
    if (input.isAnimated === isAnimated) {
      return input;
    }
    return new Message(input.messageText, isAnimated);
  }
}
