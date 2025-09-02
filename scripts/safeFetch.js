import { GithubFetchError } from "./errors.js";

export default async function safeFetch(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new GithubFetchError(
      `Network error: ${err.message}. URL: ${url}`,
      null,
      url,
    );
  }
  if (!response.ok) {
    throw new GithubFetchError(
      `GitHub API returned status ${response.status}: ${response.statusText}. URL: ${url}`,
      response.status,
      url,
    );
  }
  return response;
}
