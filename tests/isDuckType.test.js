import {
  isDuckType,
  isDuckTypeClass,
  DuckTypingError,
} from "../src/js/_lib/isDucktype/index.js";
import NativeFetchApi from "../src/js/_components/weatherReporter/nativeFetchApi.js";
import ApiContract from "../src/js/_contracts/apiContract.js";

describe("isDuckType utility", () => {
  test("NativeFetchApi fulfills ApiContract contract", () => {
    const apiInstance = new NativeFetchApi("https://example.com");
    expect(isDuckType(apiInstance, ApiContract)).toBe(true);
  });

  test("Throws DuckTypingError if contract is not fulfilled", () => {
    const badDuck = { uri: "https://example.com" }; // missing getData
    expect(() => isDuckType(badDuck, ApiContract)).toThrow(DuckTypingError);
  });
});

describe("isDuckTypeClass utility", () => {
  test("NativeFetchApi class fulfills ApiContract contract", () => {
    expect(isDuckTypeClass(NativeFetchApi, ApiContract)).toBe(true);
  });

  test("Throws DuckTypingError if class contract is not fulfilled", () => {
    class BadApi {}
    expect(() => isDuckTypeClass(BadApi, ApiContract)).toThrow(DuckTypingError);
  });
});
