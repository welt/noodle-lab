/**
 * @file blogModal.test.js
 */
import { jest } from "@jest/globals";
import BlogModal from "../../src/js/_components/blogFeature/blogModal.js";

describe("BlogModal Custom Element", () => {
  beforeAll(() => {
    if (!customElements.get("blog-modal")) {
      customElements.define("blog-modal", BlogModal);
    }
  });

  let modal;

  beforeEach(() => {
    modal = document.createElement("blog-modal");
    document.body.appendChild(modal);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("renders dialog, content, and close button", () => {
    const dialog = modal.querySelector("dialog[data-modal]");
    const content = modal.querySelector("[data-modal-content]");
    const closeBtn = modal.querySelector("[data-modal-close]");

    expect(dialog).not.toBeNull();
    expect(content).not.toBeNull();
    expect(closeBtn).not.toBeNull();
    expect(closeBtn.textContent).toMatch(/Close/i);
  });

  test("show(message) renders message and opens dialog", () => {
    const dialog = modal.querySelector("dialog[data-modal]");
    const content = modal.querySelector("[data-modal-content]");

    expect(dialog).not.toBeNull();
    dialog.showModal = jest.fn();

    modal.show("Hello World!");

    expect(content.textContent).toBe("Hello World!");
    expect(dialog.showModal).toHaveBeenCalled();
  });

  test("close() closes the dialog", () => {
    const dialog = modal.querySelector("dialog[data-modal]");
    dialog.close = jest.fn();

    modal.close();

    expect(dialog.close).toHaveBeenCalled();
  });

  test("clicking close button calls close()", () => {
    const closeSpy = jest.spyOn(modal, "close");
    const closeBtn = modal.querySelector("[data-modal-close]");

    closeBtn.click();

    expect(closeSpy).toHaveBeenCalled();
    closeSpy.mockRestore();
  });
});
