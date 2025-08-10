import normalizeRepoUrl from "../scripts/normalizeRepoUrl.js";

describe("normalizeRepoUrl", () => {
  it("returns GitHub URL for string repository", () => {
    expect(normalizeRepoUrl("fakeuser/fakerepo")).toBe(
      "https://github.com/fakeuser/fakerepo",
    );
  });

  it("returns GitHub URL for object repository with url", () => {
    expect(
      normalizeRepoUrl({ url: "https://github.com/fakeuser/fakerepo.git" }),
    ).toBe("https://github.com/fakeuser/fakerepo");
  });

  it("returns GitHub URL for object repository with git+ prefix", () => {
    expect(
      normalizeRepoUrl({ url: "git+https://github.com/fakeuser/fakerepo.git" }),
    ).toBe("https://github.com/fakeuser/fakerepo");
  });

  it("returns empty string for null repository", () => {
    expect(normalizeRepoUrl(null)).toBe("");
  });

  it("returns empty string for undefined repository", () => {
    expect(normalizeRepoUrl(undefined)).toBe("");
  });

  it("returns empty string for object repository without url", () => {
    expect(normalizeRepoUrl({})).toBe("");
  });
});
