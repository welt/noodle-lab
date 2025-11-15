import FetchCache from './fetchCache';
import { F1FetchError } from './errors.js';

const fetchCache = FetchCache.getInstance();

/**
 * fetchJson(url, { timeout, options })
 * - timeout in ms (0 = no timeout)
 * - options passed to fetch
 */
export default async function fetchJson(url, { timeout = 3000, options = {} } = {}) {
  const cachedData = await fetchCache.getCachedData(url);
  
  if (cachedData) {
    return cachedData;
  }

  const controller = new AbortController();
  const signal = controller.signal;
  const timer = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null;

  let res;
  try {
    res = await fetch(url, { ...options, signal });

    if (res.ok) {
      try {
        await fetchCache.setCachedData(url, res.clone());
      } catch (cacheErr) {
        console.warn('F1 fetchJson: cache set failed', cacheErr);
      }
    }
  } catch (err) {
    if (timer) clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new F1FetchError("Request timed out", { url, cause: err });
    }
    throw new F1FetchError("Network error", { url, cause: err });
  } finally {
    if (timer) clearTimeout(timer);
  }

  if (!res.ok) {
    let bodyText = null;
    try {
      bodyText = await res.text();
    } catch (_) {
      //
    }
    throw new F1FetchError(`HTTP ${res.status}`, {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      body: bodyText,
    });
  }

  return res;
}

