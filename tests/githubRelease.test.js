import { jest } from "@jest/globals";
import githubRelease from "../src/_data/githubRelease.js";

const mockUrl = `https://api.github.com/repos/welt/noodle-lab/tags`;

describe("githubRelease data function", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetches from the correct GitHub API URL", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ name: "v1.0.0" }],
    });
    await githubRelease();
    expect(global.fetch).toHaveBeenCalledWith(mockUrl);
  });

  it("returns an array of tag objects on success", async () => {
    const mockTags = [
      { name: "v2.1.8", commit: { url: "https://api.github.com/commit/abc" } },
      { name: "v2.1.7", commit: { url: "https://api.github.com/commit/def" } },
    ];
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockTags,
    });
    const result = await githubRelease();
    expect(result).toEqual(mockTags);
    expect(result[0].name).toBe("v2.1.8");
  });

  it("throws custom error on HTTP error", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => [],
    });
    await expect(githubRelease()).rejects.toThrow(
      /Failed to fetch tags from GitHub/,
    );
  });

  it("throws custom error on network/fetch error", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));
    await expect(githubRelease()).rejects.toThrow(/Network error/);
  });

  it("throws custom error on JSON parse error", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });
    await expect(githubRelease()).rejects.toThrow(/Failed to parse JSON/);
  });
});
