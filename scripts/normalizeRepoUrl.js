export default function normalizeRepoUrl(repo) {
  if (!repo) return "";
  if (typeof repo === "string") {
    return `https://github.com/${repo.replace(/^github:/, "")}`;
  }
  if (repo.url) {
    return repo.url
      .replace(/^git\+/, "")
      .replace(/\.git$/, "")
      .replace(/^github:/, "https://github.com/");
  }
  return "";
}
