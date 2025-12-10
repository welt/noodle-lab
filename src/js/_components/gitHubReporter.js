/**
 * @file gitHubReporter.js
 * Web component which shows the Stargazers count
 * for Eleventy project on GitHub.
 */
import Reporter from "../_contracts/reporter.js";

const src = "https://api.github.com/repos/11ty/eleventy";
const styles = ["reporter", "reporter--github"];

export default class GitHubReporter extends Reporter {
  constructor() {
    super();
    this.src = src;
  }

  renderSkeleton() {
    this.classList.add(...styles, "is-loading");
    this.innerHTML = `
      <h2 class="gh-name">Project = <span class="gh-name__value" data-gh-name>Loading…</span></h2>
      <h3 class="gh-stars">Star Gazers = <span class="gh-stars__value" data-gh-stars></span></h3>
    `;
  }

  /**
   * @param {Object} data - GitHub API response data.
   * Update only the small parts of DOM to avoid re-parsing full markup.
   */
  render(data) {
    this.classList.add(...styles);

    const nameEl = this.querySelector("[data-gh-name]");
    const starsEl = this.querySelector("[data-gh-stars]");

    if (!data) {
      if (nameEl) nameEl.textContent = "Unavailable";
      if (starsEl) starsEl.textContent = "";
      return;
    }

    if (nameEl) nameEl.textContent = data.name || "Unknown";
    if (starsEl) starsEl.textContent = String(data.stargazers_count ?? "0");
  }
}
