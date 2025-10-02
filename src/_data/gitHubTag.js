import pkg from "../../package.json" with { type: "json" };
import eleventyFetch from "@11ty/eleventy-fetch";

const REPO_USER = process.env.REPO_USER;
const REPO_NAME = process.env.REPO_NAME;

function githubApiUrl(strings, user, repo) {
  return `${strings[0]}${user}${strings[1]}${repo}${strings[2]}`;
}

const url = githubApiUrl`https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/tags`;

/**
 * Latest tag name from GitHub releases.
 * Caches response for 2 hours using @11ty/eleventy-fetch.
 * See: https://www.11ty.dev/docs/plugins/fetch/
 * @returns {string}
 */
export default async function () {
  let releases;
  try {
    const json = await eleventyFetch(url, {
      duration: "2h", // cache for 2 hours
      type: "json",
      fetchOptions: {
        headers: {
          "User-Agent": "node.js",
        },
      },
    });
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
