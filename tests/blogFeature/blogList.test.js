/**
 * @file blogList.test.js
 */
import { jest } from "@jest/globals";
import BlogList from "../../src/js/_components/blogFeature/blogList.js";
import EventBus from "../../src/js/_components/blogFeature/eventBus.js";

const eventBus = EventBus.getInstance();

describe("BlogList Custom Element", () => {
  beforeAll(() => {
    if (!customElements.get("blog-list")) {
      customElements.define("blog-list", BlogList);
    }
  });

  let list;

  beforeEach(() => {
    list = document.createElement("blog-list");
    document.body.appendChild(list);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("renders with an empty post list", () => {
    const ul = list.querySelector("#post-list");
    expect(ul).not.toBeNull();
    expect(ul.children.length).toBe(0);
  });

  test("renderPosts displays posts as clickable buttons", () => {
    const posts = [
      { title: "First Post", content: "Hello" },
      { title: "Second Post", content: "World" },
    ];
    list.renderPosts(posts);

    const ul = list.querySelector("#post-list");
    expect(ul.children.length).toBe(posts.length);

    Array.from(ul.children).forEach((li, i) => {
      const button = li.querySelector("button");
      expect(button).not.toBeNull();
      expect(button.textContent).toBe(posts[i].title);
      expect(button.classList.contains("clickable-text")).toBe(true);
    });
  });

  test("emits 'post-selected' event with post data when a post button is clicked", () => {
    const posts = [
      { title: "First Post", content: "Hello" },
      { title: "Second Post", content: "World" },
    ];
    list.renderPosts(posts);

    const handler = jest.fn();
    eventBus.on("post-selected", handler);

    const ul = list.querySelector("#post-list");
    const firstButton = ul.querySelector("button");
    firstButton.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0];
    expect(event.detail).toEqual(posts[0]);
  });
});
