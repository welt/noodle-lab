/**
 * Utility to apply a mixin to a class.
 * @param {Object} targetClass
 * @param {Object|Object[]} mixins - single object or array of objects
 */
export default function mixinApply(targetClass, mixins) {
  const mixinArray = Array.isArray(mixins) ? mixins : [mixins];
  mixinArray.forEach((mixin) => {
    Object.keys(mixin).forEach((key) => {
      targetClass.prototype[key] = mixin[key];
    });
  });
}
