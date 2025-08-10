import { jest } from "@jest/globals";
import InfoMessage from "../src/js/_components/infoFeature/infoMessage.js";

describe("InfoMessage", () => {
  it("returns a non-empty string from getText()", () => {
    const text = InfoMessage.getText();
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  it("returns the expected lorem ipsum text", () => {
    expect(InfoMessage.getText()).toMatch(/sadness of the city came suddenly/);
  });
});
