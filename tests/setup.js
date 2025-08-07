/**
 * Mocks some global browser APIs and objects.
 * Needed to test the browser Cache API.
 */
import { jest } from "@jest/globals";
import "whatwg-fetch";

// Polyfill <dialog> element methods for jsdom (Jest) compatibility
if (typeof window !== "undefined") {
  if (typeof window.HTMLDialogElement === "undefined") {
    window.HTMLDialogElement = class extends window.HTMLElement {};
  }
  window.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
}

global.caches = {
  _cache: new Map(),

  open: jest.fn().mockImplementation((cacheName) => {
    if (!global.caches._cache.has(cacheName)) {
      global.caches._cache.set(cacheName, new Map());
    }
    return Promise.resolve({
      match: jest.fn().mockImplementation((request) => {
        const cache = global.caches._cache.get(cacheName);
        return Promise.resolve(cache.get(request) || null);
      }),
      put: jest.fn().mockImplementation((request, response) => {
        const cache = global.caches._cache.get(cacheName);
        cache.set(request, response);
        return Promise.resolve();
      }),
      delete: jest.fn().mockImplementation((request) => {
        const cache = global.caches._cache.get(cacheName);
        cache.delete(request);
        return Promise.resolve();
      }),
      keys: jest.fn().mockImplementation(() => {
        const cache = global.caches._cache.get(cacheName);
        return Promise.resolve(Array.from(cache.keys()));
      }),
    });
  }),
};

global.Response = class {
  constructor(body, init) {
    this.body = body;
    this.headers = new Map(Object.entries(init.headers));
  }
  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
  get headers() {
    return this._headers;
  }
  set headers(headers) {
    this._headers = headers;
  }
};
