import pkg from "../../package.json" with { type: "json" };
import safeFetch from "../../scripts/safeFetch.js";
import safeJson from "../../scripts/safeJson.js";

const REPO_USER = process.env.REPO_USER;
const REPO_NAME = process.env.REPO_NAME;

function githubApiUrl(strings, user, repo) {
  return `${strings[0]}${user}${strings[1]}${repo}${strings[2]}`;
}

const url = githubApiUrl`https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/tags`;

/**
 * Latest tag name from GitHub releases.
 * @returns {string}
 */
export default async function () {
  let releases;
  try {
    const response = await safeFetch(url);
    const json = await safeJson(response, url);
    if (Array.isArray(json)) {
      releases = json.map((tag) => ({
        name: tag.name,
      }));
    } else {
      releases = [json];
    }
    const [latestTag] = releases;
    return latestTag;
  } catch (err) {
    return { name: pkg.version ? `v${pkg.version}` : "unknown" };
  }
}
