/**
 * Reactive data store.
 * @param {Object<any>} data 
 * @param {String} name 
 * @returns 
 */
export default function store(data = {}, name = 'store') {
  /**
     * Emit a custom event
     * @param  {String} type   Event type
     * @param  {*}      detail Details to pass along with the event
     */
  const emit = (type, detail) => {
    if (!type) throw new Error('You must specify a name for this event.');
        const event = new CustomEvent(type, {
            bubbles: true,
            cancelable: true,
            detail: detail
    });
    console.log('>>> detail', detail);
    return document.dispatchEvent(event);
  }
  
  return new Proxy(data, {
    get: function (obj, prop) {
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
    }
  });  
}
