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
      composed: true,
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
    get: function (thing, prop) {
      if (prop === "length" && Array.isArray(thing)) {
        return thing.length;
      }
      if (Array.isArray(thing) && arrayMethods.includes(prop)) {
        return function (...args) {
          const result = Array.prototype[prop].apply(thing, args);
          emit(name, thing);
          return result;
        };
      }
      return thing[prop];
    },
    set: function (thing, prop, value) {
      if (thing[prop] === value) return true;
      thing[prop] = value;
      emit(name, data);
      return true;
    },
    deleteProperty: function (thing, prop) {
      delete thing[prop];
      emit(name, data);
      return true;
    },
  });

  return proxy;
}
