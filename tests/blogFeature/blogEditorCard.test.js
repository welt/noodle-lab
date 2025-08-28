/**
 * @file blogEditorCard.test.js
 */
import { jest } from "@jest/globals";
import BlogEditorCard from "../../src/js/_components/blogFeature/blogEditorCard.js";
import BlogEditor from "../../src/js/_components/blogFeature/blogEditor.js";
import EventBus from "../../src/js/_components/blogFeature/eventBus";

const eventBus = EventBus.getInstance();

describe("BlogEditorCard Custom Element", () => {
  beforeAll(() => {
    if (!customElements.get("blog-editor-card")) {
      customElements.define("blog-editor-card", BlogEditorCard);
    }
    if (!customElements.get("blog-editor")) {
      customElements.define("blog-editor", BlogEditor);
    }
  });

  let card;

  beforeEach(() => {
    card = document.createElement("blog-editor-card");
    document.body.appendChild(card);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("renders with correct classes and content", () => {
    expect(card.classList.contains("blog-editor-card")).toBe(true);
    expect(card.classList.contains("card")).toBe(true);
    expect(card.classList.contains("grid-item")).toBe(true);

    expect(card.querySelector("h2").textContent).toMatch(/DIY Web Log/i);
    expect(card.querySelector("p").textContent).toMatch(/personal blog/i);
  });

  test("contains a blog-editor child element", () => {
    const editor = card.querySelector("blog-editor");
    expect(editor).not.toBeNull();
  });

  test("forwards 'post-created' event from blog-editor", () => {
    const handler = jest.fn();
    eventBus.on("post-created", handler);

    const detail = { title: "Forwarded Title", content: "Forwarded Content" };
    eventBus.emit("post-created", detail);

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0];
    expect(event.detail).toEqual(detail);
  });
});
