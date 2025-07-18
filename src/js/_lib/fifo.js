/**
 * A simple FIFO queue class.
 */
const defaults = {
  maxLength: 3,
};

export default class Fifo {
  #maxLength;
  #elements;

  constructor(maxLength, ...elements) {
    this.#elements = [...elements];
    this.#maxLength = maxLength || defaults.maxLength;
  }

  #checkLength() {
    if (this.length > this.#maxLength) {
      this.shift();
    }
  }

  push(...args) {
    const res = this.#elements.push(...args);
    this.#checkLength();
    return res;
  }

  shift(...args) {
    return this.#elements.shift(...args);
  }

  get length() {
    return this.#elements.length;
  }

  [Symbol.iterator]() {
    let index = 0;
    const elements = this.#elements;
    return {
      next() {
        if (index < elements.length) {
          return {
            value: elements[index++],
            done: false,
          };
        } else {
          return { done: true };
        }
      },
    };
  }

  toString() {
    return this.#elements.toString();
  }
  
  toArray() {
    return [...this.#elements];
  }

  set length(_value) {
    throw new Error("Property 'length' is read-only.");
  }

  pop() {
    throw new Error("Method not implemented.");
  }

  unshift() {
    throw new Error("Method not implemented.");
  }
}
