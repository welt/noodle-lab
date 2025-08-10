import { jest } from "@jest/globals";
import GitHubLinkButton from "../src/js/_components/gitHubLinkButton.js";

describe("GitHubLinkButton", () => {
  beforeAll(() => {
    customElements.define("github-link-button", GitHubLinkButton);
  });

  it("renders a link with the correct href when repo-url attribute is valid", () => {
    const el = document.createElement("github-link-button");
    el.setAttribute("repo-url", "https://github.com/fakeuser/fakerepo");
    document.body.appendChild(el);

    const anchor = el.querySelector("a");
    expect(anchor).not.toBeNull();
    expect(anchor.getAttribute("href")).toBe(
      "https://github.com/fakeuser/fakerepo",
    );
    const svg = el.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("renders nothing if repo-url attribute is missing and there is no injected fallback", () => {
    const el = document.createElement("github-link-button");
    document.body.appendChild(el);
    expect(el.innerHTML).toBe("");
  });

  it("renders nothing if repo-url attribute is invalid and there is no injected fallback", () => {
    const el = document.createElement("github-link-button");
    el.setAttribute("repo-url", "lorem-ipsum-not-a-github-url");
    document.body.appendChild(el);
    expect(el.innerHTML).toBe("");
  });
});
