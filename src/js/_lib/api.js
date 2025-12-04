/**
 * @file api.js
 * Wrapper around the Fetch API to make it easier
 * to fetch and optionally cache data from an API.
 */
/* eslint-disable no-unused-vars */
import CacheApiCache from "./cacheApiCache";
import CookieCache from "./cookieCache";
import LocalCache from "./localCache";
import MemoryCache from "./memoryCache"; // !! This cache can not persist on page refresh.
import SessionCache from "./sessionCache";
/* eslint-enable no-unused-vars */

class ApiError extends Error {
  constructor(message = "API error", details = {}) {
    super(message);
    this.name = "ApiError";
    this.details = details;
  }
}

const defaultOptions = {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
  useCache: true, // !! Non-Fetch local option for this module.
  cacheStrategy: CacheApiCache, // !! Non-Fetch local option for this module.
};

const _privateFields = new WeakMap();
const API_TIMEOUT_MS = 30000; // 30 seconds

/**
 * Wrapper function with same signature as Fetch.
 * @param {String} uri
 * @param {Object} options
 * @constructor
 */
export default function Api(uri, options = {}) {
  if (!uri) {
    throw new ApiError("URI is required");
  }

  const { useCache, cacheStrategy, ...fetchOptions } = {
    ...defaultOptions,
    ...options,
  };

  _privateFields.set(this, {
    uri,
    useCache: !!useCache,
    request: new Request(uri, fetchOptions),
    cache: new cacheStrategy(),
  });
}

Api.prototype.getData = async function () {
  const { uri, useCache, request, cache } = _privateFields.get(this);
  const cachedData = useCache && (await cache.getCachedData(uri));
  if (cachedData) return cachedData;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response, data;

  try {
    response = await fetch(request, { signal: controller.signal });
  } catch (networkError) {
    console.error("API network error:", networkError);
    clearTimeout(timeoutId);
    if (networkError.name === "AbortError") {
      throw new ApiError("Request timed out after 30 seconds", { uri });
    }
    throw new ApiError("Network error during API request", {
      cause: networkError,
      uri,
    });
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    console.error("API response not OK:", response.status, response.statusText);
    throw new ApiError("Network response was not ok", {
      status: response.status,
      statusText: response.statusText,
      uri,
    });
  }

  try {
    data = await response.json();
  } catch (jsonError) {
    console.error("API JSON parse error:", jsonError);
    throw new ApiError("Failed to parse API response", {
      cause: jsonError,
      uri,
    });
  }

  if (useCache) {
    try {
      await cache.setCachedData(uri, data);
    } catch (cacheError) {
      console.warn("API failed to cache data:", cacheError);
    }
  }
  return data;
};
