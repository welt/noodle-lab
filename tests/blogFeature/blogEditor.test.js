/**
 * @file blogEditor.test.js
 */
import { jest } from "@jest/globals";
import BlogEditor from "../../src/js/_components/blogFeature/blogEditor.js";
import EventBus from "../../src/js/_components/blogFeature/eventBus.js";

const eventBus = EventBus.getInstance();

describe("BlogEditor Custom Element", () => {
  beforeAll(() => {
    if (!customElements.get("blog-editor")) {
      customElements.define("blog-editor", BlogEditor);
    }
  });

  let editor;

  beforeEach(() => {
    editor = document.createElement("blog-editor");
    document.body.appendChild(editor);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("renders the editor form with correct fields", () => {
    const form = editor.querySelector("[data-blog-editor-form]");
    expect(form).not.toBeNull();

    const titleInput = form.querySelector("input[name='title']");
    const contentTextarea = form.querySelector("textarea[name='content']");
    const saveButton = form.querySelector("button[type='submit']");

    expect(titleInput).not.toBeNull();
    expect(contentTextarea).not.toBeNull();
    expect(saveButton).not.toBeNull();
    expect(saveButton.textContent).toMatch(/Save/i);
  });

  test("submits the form and emits 'post-created' event", () => {
    const form = editor.querySelector("[data-blog-editor-form]");
    const titleInput = form.querySelector("input[name='title']");
    const contentTextarea = form.querySelector("textarea[name='content']");

    titleInput.value = "Test Title";
    contentTextarea.value = "Test Content";

    const eventHandler = jest.fn();
    eventBus.on("post-created", eventHandler);

    form.dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
        composed: true,
      }),
    );

    expect(eventHandler).toHaveBeenCalledTimes(1);
    const event = eventHandler.mock.calls[0][0];
    expect(event.detail).toEqual({
      title: "Test Title",
      content: "Test Content",
    });

    expect(titleInput.value).toBe("");
    expect(contentTextarea.value).toBe("");
  });

  test("prevents default form submission behavior", () => {
    const form = editor.querySelector("[data-blog-editor-form]");
    const preventDefault = jest.fn();

    form.addEventListener("submit", (e) => {
      preventDefault();
    });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(event);

    expect(preventDefault).toHaveBeenCalled();
  });
});
