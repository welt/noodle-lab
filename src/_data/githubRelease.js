import safeFetch from "../../scripts/safeFetch.js";
import safeJson from "../../scripts/safeJson.js";

const REPO_USER = process.env.REPO_USER;
const REPO_NAME = process.env.REPO_NAME;

function githubApiUrl(strings, user, repo) {
  return `${strings[0]}${user}${strings[1]}${repo}${strings[2]}`;
}

const url = githubApiUrl`https://api.github.com/repos/${REPO_USER}/${REPO_NAME}/tags`;

export default async function githubRelease() {
  const response = await safeFetch(url);
  return await safeJson(response, url);
}
