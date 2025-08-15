/**
 * @file getClassShape.js
 * Returns the shape of a class: its prototype methods.
 * Avoids instantiating the class, so works with abstract contracts.

 */
import getClassMethods from "./getClassMethods";

/**
 * Get the shape of a class.
 * @param {Class} clazz - The class to get the shape of.
 * @returns {Object} Object containing the methods and properties of the class.
 */
export default function getClassShape(clazz) {
  const methods = getClassMethods(clazz);
  return { methods, properties: [] };
}
