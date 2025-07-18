/**
 * Finds a target element in an array, removes it,
 * and returns removed element.
 * If the target element is not found, returns `null`.
 * !!Mutates the array.
 *
 * @param {Array} array - Array to search within.
 * @param {any} target - Element to find.
 * @returns {any|null} - The removed element if found, or Null if not.
 */
export default function findAndPop(array, target) {
  const index = array.findIndex((element) => element === target);
  if (index !== -1) {
    return array.splice(index, 1)[0];
  }
  return null;
}
