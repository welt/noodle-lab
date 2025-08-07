import { jest } from "@jest/globals";
import ErrorDialog from "../src/js/_components/ErrorDialog.js";

if (!customElements.get("error-dialog")) {
  customElements.define("error-dialog", ErrorDialog);
}

describe("ErrorDialog", () => {
  let dialog;

  beforeEach(() => {
    dialog = document.createElement("error-dialog");
    document.body.appendChild(dialog);
  });

  afterEach(() => {
    document.body.removeChild(dialog);
  });

  test("renders and attaches to the DOM", () => {
    expect(document.body.contains(dialog)).toBe(true);
  });

  test("show() opens the dialog and displays the message", () => {
    const message = "Direct show test message";
    dialog.show(message);
    const nativeDialog = dialog.shadowRoot.querySelector("dialog");
    expect(nativeDialog.open).toBe(true);
    expect(nativeDialog.textContent).toContain(message);
  });

  test("shows the dialog with a message", () => {
    const message = "Test error message";
    dialog.show(message);

    // The native <dialog> should be open and contain the message
    const nativeDialog = dialog.shadowRoot.querySelector("dialog");
    expect(nativeDialog.open).toBe(true);
    expect(nativeDialog.textContent).toContain(message);
  });

  test("closes the dialog", () => {
    dialog.show("Some error");
    const nativeDialog = dialog.shadowRoot.querySelector("dialog");
    expect(nativeDialog.open).toBe(true);

    dialog.close();
    expect(nativeDialog.open).toBe(false);
  });
});
