/**
 * Reactive data store with array support.
 * @param {Object<any>} data
 * @param {String} name
 * @returns
 */
export default function store(data = {}, name = "store") {
  /**
   * Emit a custom event
   * @param  {String} type   Event type
   * @param  {*}      detail Details to pass along with the event
   */
  const emit = (type, detail) => {
    if (!type) throw new Error("You must specify a name for this event.");
    const event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: detail,
    });
    return document.dispatchEvent(event);
  };

  const arrayMethods = [
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "sort",
    "reverse",
  ];

  const proxy = new Proxy(data, {
    get: function (obj, prop) {
      if (Array.isArray(obj) && arrayMethods.includes(prop)) {
        return function (...args) {
          const result = Array.prototype[prop].apply(obj, args);
          emit(name, obj);
          return result;
        };
      }
      return obj[prop];
    },
    set: function (obj, prop, value) {
      if (obj[prop] === value) return true;
      obj[prop] = value;
      emit(name, data);
      return true;
    },
    deleteProperty: function (obj, prop) {
      delete obj[prop];
      emit(name, data);
      return true;
    },
  });

  return proxy;
}
