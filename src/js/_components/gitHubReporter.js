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

  /**
   * @param {Object} data - GitHub API response data.
   */
  render(data) {
    this.classList.add(...styles);
    this.innerHTML = `
      <h2>Project = ${data.name}</h2>
      <h3>Star Gazers = ${data.stargazers_count}</h3>
    `;
  }
}
