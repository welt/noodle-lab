import getClassShape from "./getClassShape";
import { DuckTypingError } from "./errors";

/**
 * Checks if classA fulfills the contract of classB (duck typing).
 * @param {Function} classA - The class to check (implementation).
 * @param {Function} classB - The class to check against (contract/interface).
 * @returns {boolean} - True if classA fulfills classB's contract.
 */
export default function isDuckTypeClass(classA, classB) {
  if (typeof classA !== "function" || typeof classB !== "function") {
    throw new DuckTypingError(
      `Both arguments to isDuckTypeClass must be constructor functions (classes). Got: classA=${classA}, classB=${classB}`,
      { classA, classB },
    );
  }

  const { methods: contractMethods } = getClassShape(classB);
  const { methods: implMethods } = getClassShape(classA);

  const missingMethods = contractMethods.filter(
    (method) => !implMethods.includes(method),
  );

  if (missingMethods.length) {
    throw new DuckTypingError(
      `Class ${classA.name} does not fulfill the contract of ${classB.name}`,
      { missingMethods },
    );
  }

  return true;
}
