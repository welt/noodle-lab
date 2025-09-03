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

  /**
   * Maps array mutator method names to event emitter functions.
   * @type {Object<string, Function>}
   */
  const arrayEventMap = {
    push: (args, data, name) =>
      emit(`${name}-added`, { item: args[0], result: data }),
    unshift: (args, data, name) =>
      emit(`${name}-added`, { item: args[0], result: data }),
    pop: (args, data, name, result) =>
      emit(`${name}-removed`, { item: result, result: data }),
    shift: (args, data, name, result) =>
      emit(`${name}-removed`, { item: result, result: data }),
    splice: (args, data, name) =>
      emit(`${name}-spliced`, { args, result: data }),
    sort: (args, data, name) => emit(`${name}-reordered`, { result: data }),
    reverse: (args, data, name) => emit(`${name}-reordered`, { result: data }),
  };

  const arrayMethods = Object.keys(arrayEventMap);

  const proxy = new Proxy(data, {
    get: function (thing, prop) {
      if (prop === "length" && Array.isArray(thing)) {
        return thing.length;
      }
      if (Array.isArray(thing) && arrayMethods.includes(prop)) {
        return function (...args) {
          const result = Array.prototype[prop].apply(thing, args);
          emit(name, thing); // generic store event
          if (arrayEventMap[prop]) {
            // specific store event
            arrayEventMap[prop](args, thing, name, result);
          }
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
