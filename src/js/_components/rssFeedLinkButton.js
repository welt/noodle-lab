/**
 * @file RssFeedLinkButton.js
 * component that links to RSS feed
 */

const isValidFeedUrl = (url) =>
  typeof url === "string" && /^https?:\/\/.+\.(xml|rss)$/.test(url);

export default class RssFeedLinkButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Use feed-url attribute if provided and valid, otherwise default to /feed.xml
    let feedUrl = this.getAttribute("feed-url");
    if (!isValidFeedUrl(feedUrl)) {
      feedUrl = "/feed.xml";
    }

    this.innerHTML = `
      <style>
        svg {
          width: 30px;
          height: 30px;
          fill: currentColor;
        }
      </style>
      <a href="${feedUrl}" class="icon" rel="alternate" type="application/rss+xml">
        <span class="sr-only">RSS Feed</span>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path fill="currentColor"
            d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248S0 22.546 0 20.752s1.456-3.248 3.252-3.248
            3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
        </svg>
      </a>
    `;
  }
}
