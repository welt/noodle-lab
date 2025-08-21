const REPO_USER = process.env.REPO_USER;
const REPO_NAME = process.env.REPO_NAME;

function githubApiUrl(strings, user, repo) {
  return `${strings[0]}${user}${strings[1]}${repo}${strings[2]}`;
}

const url = githubApiUrl`https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/tags`;

class GithubReleaseError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = "GithubReleaseError";
    this.status = status;
    this.url = url;
  }
}

export default async function githubRelease() {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    // Network error.
    console.error(err);
    throw new GithubReleaseError(
      `Network error: ${err.message}. URL: ${url}`,
      null,
      url,
    );
  }

  if (!res.ok) {
    // HTTP status error.
    console.error(
      `GitHub API returned status ${res.status}: ${res.statusText}`,
    );
    throw new GithubReleaseError(
      `Failed to fetch tags from GitHub. Status: ${res.status} ${res.statusText}. URL: ${url}`,
      res.status,
      url,
    );
  }

  let json;
  try {
    json = await res.json();
  } catch (err) {
    // JSON parse error.
    console.error(err);
    throw new GithubReleaseError(
      `Failed to parse JSON from GitHub response. URL: ${url}`,
      res.status,
      url,
    );
  }

  const [tags] = json;
  return tags;
}
