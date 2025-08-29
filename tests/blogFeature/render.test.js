import { jest } from "@jest/globals";
import {
  eraseContents,
  renderTags,
  render,
} from "../../src/js/_components/blogFeature/render.js";

describe("render.js exports", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test("eraseContents removes all children", () => {
    container.innerHTML = "<span></span><p></p>";
    eraseContents(container);
    expect(container.childNodes.length).toBe(0);
  });

  test("renderTags appends correct elements", () => {
    renderTags({ h1: "Title", p: "Paragraph" }, container);
    expect(container.querySelector("h1").textContent).toBe("Title");
    expect(container.querySelector("p").textContent).toBe("Paragraph");
    expect(container.childNodes.length).toBe(2);
  });

  test("renderTags skips falsy values", () => {
    renderTags({ h1: "", p: null, span: undefined }, container);
    expect(container.childNodes.length).toBe(0);
  });

  test("render renders object with title and content", () => {
    render(container, { title: "Hello", content: "World" });
    expect(container.querySelector("h3").textContent).toBe("Hello");
    expect(container.querySelector("p").textContent).toBe("World");
  });

  test("render renders string as paragraph", () => {
    render(container, "Just a string");
    expect(container.querySelector("p").textContent).toBe("Just a string");
    expect(container.childNodes.length).toBe(1);
  });

  test("render does nothing if container is null", () => {
    expect(() => render(null, "Test")).not.toThrow();
  });

  test("render does nothing for non-object, non-string message", () => {
    render(container, 42);
    expect(container.childNodes.length).toBe(0);
    render(container, undefined);
    expect(container.childNodes.length).toBe(0);
  });
});
