export default class Column {
  constructor(
    index,
    fontSize,
    startRow = 0,
    charInterval = null,
    stepX = null,
  ) {
    this.index = index;
    this.fontSize = fontSize;
    this.stepX = stepX ?? fontSize; // horizontal advance per column
    this.row = startRow;
    this.char = null;
    this.charElapsed = 0;
    this.charInterval =
      charInterval == null ? 0.05 + Math.random() * 4 : charInterval;
  }
  get x() {
    return this.index * this.stepX;
  }
  get y() {
    return this.row * this.fontSize;
  }
  /**
   * Advance column position and update char timer.
   * @param {number} deltaRows rows to advance this frame
   * @param {number} deltaTime seconds elapsed since last frame
   * @param {number} viewportHeight CSS-pixel height of the stage
   * @param {number} [resetChance=0.975] chance to NOT reset when offscreen
   * @param {number} [maxOffset=20] max negative row offset when resetting
   */
  stepBy(
    deltaRows,
    deltaTime,
    viewportHeight,
    resetChance = 0.975,
    maxOffset = 20,
  ) {
    const shouldReset =
      this.row * this.fontSize > viewportHeight && Math.random() > resetChance;
    this.row = shouldReset
      ? Math.floor(Math.random() * -maxOffset)
      : this.row + deltaRows;
    this.charElapsed += deltaTime;
  }
  /**
   * Maybe replace the current character using char factory
   * @param {Function} charFactory returns the next character string
   */
  maybeUpdateChar(charFactory) {
    if (this.char == null || this.charElapsed >= this.charInterval) {
      this.char = charFactory();
      this.charElapsed = 0;
    }
  }
}
