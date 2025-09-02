import { GithubFetchError } from "./errors.js";

export default async function safeJson(response, url) {
  try {
    return await response.json();
    /* eslint-disable no-unused-vars */
  } catch (err) {
    throw new GithubFetchError(
      `Failed to parse JSON from GitHub response. URL: ${url}`,
      response.status,
      url,
    );
  }
}
