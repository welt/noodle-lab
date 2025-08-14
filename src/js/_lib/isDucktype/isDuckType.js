/**
 * Tests whether an object is a duck type of a class.
 * @file isDuckType.js
 * @see https://en.wikipedia.org/wiki/Duck_typing
 *
 * Fun experimental utility for comparing the "shape"
 * of an ES5 constructor function with an ES6 class
 * using duck typing. Gives a method for dynamic contract
 * checking between older ES5 and modern ES6 JavaScript
 * object patterns.
 */
import getClassShape from "./getClassShape";
import { DuckTypingError } from "./errors";

/**
 *
 * @param {object} obj - Object to check, eg. ES5 Constructor Function
 * @param {class} clazz - Class to check against
 * @returns {boolean} - True if obj is a duck type of clazz, false otherwise
 */
export default function isDuckType(obj, clazz) {
  const { methods } = getClassShape(clazz);

  const missingMethods = methods.filter(
    (method) => typeof obj[method] !== "function",
  );

  if (missingMethods.length) {
    throw new DuckTypingError(
      `Object does not fulfill the contract of ${clazz.name}`,
      { missingMethods },
    );
  }

  return true;
}
