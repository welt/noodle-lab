/**
 * Utility to apply a mixin to a class.
 * @param {Object} targetClass 
 * @param {Object} mixin 
 */
export default function mixinApply(targetClass, mixin) {
  Object.keys(mixin).forEach((key) => {
    targetClass.prototype[key] = mixin[key];
  });
}
