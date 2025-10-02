import { jest } from "@jest/globals";
import RssFeedLinkButton from "../src/js/_components/rssFeedLinkButton.js";

describe("RssFeedLinkButton", () => {
  beforeAll(() => {
    customElements.define("rss-feed-link-button", RssFeedLinkButton);
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create element with default feed URL when no attributes provided", () => {
    const element = document.createElement("rss-feed-link-button");
    document.body.appendChild(element);

    const link = element.querySelector("a");
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/feed.xml");
    expect(link.getAttribute("rel")).toBe("alternate");
    expect(link.getAttribute("type")).toBe("application/rss+xml");

    const srOnly = element.querySelector(".sr-only");
    expect(srOnly.textContent).toBe("RSS Feed");

    const svg = element.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });

  it("should use feed-url attribute when provided with valid URL", () => {
    const element = document.createElement("rss-feed-link-button");
    element.setAttribute("feed-url", "https://example.com/rss.xml");
    document.body.appendChild(element);

    const link = element.querySelector("a");
    expect(link.getAttribute("href")).toBe("https://example.com/rss.xml");
  });

  it("should fall back to default URL when feed-url attribute is invalid", () => {
    const element = document.createElement("rss-feed-link-button");
    element.setAttribute("feed-url", "invalid-url");
    document.body.appendChild(element);

    const link = element.querySelector("a");
    expect(link.getAttribute("href")).toBe("/feed.xml");
  });

  it("should accept various valid feed URL formats", () => {
    const validUrls = [
      "https://example.com/feed.xml",
      "http://example.com/rss.xml",
      "https://subdomain.example.com/feeds/feed.xml",
    ];

    validUrls.forEach((url) => {
      document.body.innerHTML = "";
      const element = document.createElement("rss-feed-link-button");
      element.setAttribute("feed-url", url);
      document.body.appendChild(element);

      const link = element.querySelector("a");
      expect(link.getAttribute("href")).toBe(url);
    });
  });

  it("should reject invalid feed URL formats and fall back to default", () => {
    const invalidUrls = [
      "not-a-url",
      "https://example.com/feed.html",
      "ftp://example.com/feed.xml",
      "",
    ];

    invalidUrls.forEach((url) => {
      document.body.innerHTML = "";
      const element = document.createElement("rss-feed-link-button");
      element.setAttribute("feed-url", url);
      document.body.appendChild(element);

      const link = element.querySelector("a");
      expect(link.getAttribute("href")).toBe("/feed.xml");
    });
  });
});
