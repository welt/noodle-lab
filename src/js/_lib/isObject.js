/**
 * Check if a value is an object.
 * @param {Any} thing
 */
export default (thing) => {
  return (
    thing !== null && typeof thing === "object" && thing.constructor === Object
  );
};
