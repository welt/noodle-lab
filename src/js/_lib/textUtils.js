/**
 * @file textUtils.js
 * Misc text processing utilities.
 */
export default {
  /**
   * Converts string to title case.
   * @param {string} str
   * @returns string
   */
  toTitleCase(str) {
    return str.replace(
      /\p{L}+/gu,
      (word) => word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase(),
    );
  },
  /**
   * Converts string to lower case.
   * @param {string} str
   * @returns string
   */
  toLowerCase(str) {
    return str.toLowerCase();
  },
};
