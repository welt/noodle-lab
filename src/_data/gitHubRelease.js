import eleventyFetch from "@11ty/eleventy-fetch";

const REPO_USER = process.env.REPO_USER;
const REPO_NAME = process.env.REPO_NAME;

function githubApiUrl(strings, user, repo) {
  return `${strings[0]}${user}${strings[1]}${repo}${strings[2]}`;
}

const url = githubApiUrl`https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/tags`;

async function betterTags(tags) {
  const base = "https://api.github.com/repos/welt/noodle-lab/commits/";
  const results = await Promise.all(
    tags.map(async (tag) => {
      const sha = tag.commit && tag.commit.sha;
      if (!sha) return { name: tag.name, sha: null, date: null };
      const body = await eleventyFetch(base + sha, {
        duration: "2h",
        type: "json",
        fetchOptions: {
          headers: {
            "User-Agent": "node.js",
          },
        },
      });

      const date =
        (body &&
          body.commit &&
          body.commit.author &&
          body.commit.author.date) ||
        null;
      return { name: tag.name, sha, date };
    }),
  );
  return results;
}

/**
 * Fetches GitHub tags and caches for 2 hours.
 * See: https://www.11ty.dev/docs/plugins/fetch/
 */
export default async function gitHubRelease() {
  const tags = await eleventyFetch(url, {
    duration: "2h",
    type: "json",
    fetchOptions: {
      headers: {
        "User-Agent": "node.js",
      },
    },
  });
  const datedTags = await betterTags(tags);
  return datedTags;
}
