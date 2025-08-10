/**
 * @file ensureContract.js
 * Duck-typing to enforce contracts.
 * Recurses up the prototype chain to ensure that
 * all methods are implemented.
 */
export default {
  ensureContract: function (obj, methods = []) {
    const name =
      obj.constructor && obj.constructor.name
        ? obj.constructor.name
        : typeof obj;
    for (const method of methods) {
      let found = false;
      let proto = obj;
      while (proto) {
        if (typeof proto[method] === "function") {
          found = true;
          break;
        }
        proto = Object.getPrototypeOf(proto);
      }
      if (!found) {
        throw new TypeError(`${name} must implement a '${method}' method`);
      }
    }
  },
};
