import pkg from "../../package.json" with { type: "json" };

const REPO_USER = process.env.REPO_USER;
const REPO_NAME = process.env.REPO_NAME;

function githubApiUrl(strings, user, repo) {
  return `${strings[0]}${user}${strings[1]}${repo}${strings[2]}`;
}

const url = githubApiUrl`https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/tags`;

/**
 * Custom Error class.
 */
class GithubReleaseError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = "GithubReleaseError";
    this.status = status;
    this.url = url;
  }
}

/**
 * @param {string} url - URL to fetch JSON from.
 * @returns {Promise<object>} - Promise for JSON data.
 * @throws {GithubReleaseError}
 */
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok)
    throw new GithubReleaseError(
      `HTTP ${response.status}: ${response.statusText}`,
    );
  return response.json();
}

/**
 * Latest tag name from GitHub releases.
 * @returns {string}
 */
export default async function () {
  let releases;
  try {
    const json = await fetchJson(url);
    if (Array.isArray(json)) {
      releases = json.map((tag) => ({
        name: tag.name,
      }));
    } else {
      releases = [json];
    }
    const [latestTag] = releases;
    return latestTag;
    /* eslint-disable no-unused-vars */
  } catch (err) {
    return { name: `v${pkg.version}` };
  }
}
