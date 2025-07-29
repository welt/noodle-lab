import { jest } from "@jest/globals";
import textUtils from "../src/js/_lib/textUtils.js";

describe("Test the text processing utilities", () => {
  test("toTitleCase converts ASCII words to title case", () => {
    expect(textUtils.toTitleCase("hello world")).toBe("Hello World");
    expect(textUtils.toTitleCase("FOO BAR")).toBe("Foo Bar");
    expect(textUtils.toTitleCase("sPoNGe BOb")).toBe("Sponge Bob");
    expect(textUtils.toTitleCase("ÜBERNACHTUNG")).toBe("Übernachtung");
  });

  test("toLowerCase converts string to all lowercase", () => {
    expect(textUtils.toLowerCase("HELLO WORLD")).toBe("hello world");
    expect(textUtils.toLowerCase("Foo Bar")).toBe("foo bar");
    expect(textUtils.toLowerCase("ÜBERNACHTUNG")).toBe("übernachtung");
  });
});
