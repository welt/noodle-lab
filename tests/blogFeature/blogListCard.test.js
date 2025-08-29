/**
 * @file blogListCard.test.js
 */
import { jest } from "@jest/globals";
import BlogListCard from "../../src/js/_components/blogFeature/blogListCard.js";
import BlogList from "../../src/js/_components/blogFeature/blogList.js";
import EventBus from "../../src/js/_components/blogFeature/eventBus.js";

const eventBus = EventBus.getInstance();

describe("BlogListCard Custom Element", () => {
  beforeAll(() => {
    if (!customElements.get("blog-list-card")) {
      customElements.define("blog-list-card", BlogListCard);
    }
    if (!customElements.get("blog-list")) {
      customElements.define("blog-list", BlogList);
    }
  });

  let card;

  beforeEach(() => {
    card = document.createElement("blog-list-card");
    document.body.appendChild(card);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("renders with correct classes and content", () => {
    expect(card.classList.contains("blog-list-card")).toBe(true);
    expect(card.classList.contains("card")).toBe(true);
    expect(card.classList.contains("grid-item")).toBe(true);

    expect(card.querySelector("h2").textContent).toMatch(/Posts/i);
  });

  test("contains a blog-list child element", () => {
    const list = card.querySelector("blog-list");
    expect(list).not.toBeNull();
  });

  test("forwards 'post-selected' event from blog-list", () => {
    const handler = jest.fn();
    eventBus.on("post-selected", handler);

    const detail = { title: "Forwarded Title", content: "Forwarded Content" };
    eventBus.emit("post-selected", detail);

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0];
    expect(event.detail).toEqual(detail);
  });

  test("renderPosts delegates to blog-list", () => {
    const posts = [
      { title: "First Post", content: "Hello" },
      { title: "Second Post", content: "World" },
    ];
    const list = card.querySelector("blog-list");
    const spy = jest.spyOn(list, "renderPosts");

    card.renderPosts(posts);

    expect(spy).toHaveBeenCalledWith(posts);
    spy.mockRestore();
  });
});
