import eleventyFetch from "@11ty/eleventy-fetch";

const REPO_USER = process.env.REPO_USER;
const REPO_NAME = process.env.REPO_NAME;

function githubApiUrl(strings, user, repo) {
  return `${strings[0]}${user}${strings[1]}${repo}${strings[2]}`;
}

const url = githubApiUrl`https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/tags`;

/**
 * Fetches GitHub tags and caches for 2 hours.
 * See: https://www.11ty.dev/docs/plugins/fetch/
 */
export default async function gitHubRelease() {
  return await eleventyFetch(url, {
    duration: "2h", // cache for 2 hours
    type: "json",
    fetchOptions: {
      headers: {
        "User-Agent": "node.js",
      },
    },
  });
}
