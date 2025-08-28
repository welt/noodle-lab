export default class EventBus {
  constructor() {
    if (EventBus.instance) {
      return EventBus.instance;
    }
    this.eventTarget = new EventTarget();
    EventBus.instance = this;
  }

  static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  emit(event, data, options = {}) {
    const customEvent = new CustomEvent(event, {
      detail: data,
      ...options,
    });
    this.eventTarget.dispatchEvent(customEvent);
  }

  on(event, listener) {
    this.eventTarget.addEventListener(event, listener);
  }

  off(event, listener) {
    this.eventTarget.removeEventListener(event, listener);
  }
}
