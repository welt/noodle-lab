import { jest } from "@jest/globals";
import cookies from "../src/js/_components/blogFeature/cookies.js";

describe("cookies module", () => {
  const testName = "testCookie";
  const testValue = "testValue";

  afterEach(() => {
    cookies.deleteCookie(testName);
  });

  test("setCookie sets a cookie", () => {
    cookies.setCookie(testName, testValue, 1);
    expect(document.cookie).toMatch(new RegExp(`${testName}=${testValue}`));
  });

  test("getCookie retrieves a cookie value", () => {
    cookies.setCookie(testName, testValue, 1);
    expect(cookies.getCookie(testName)).toBe(testValue);
  });

  test("getCookie returns undefined for non-existent cookie", () => {
    expect(cookies.getCookie("nonExistentCookie")).toBeNull();
  });

  test("deleteCookie removes a cookie", () => {
    cookies.setCookie(testName, testValue, 1);
    cookies.deleteCookie(testName);
    expect(cookies.getCookie(testName)).toBeNull();
  });

  test("setCookie sets cookie with expiration", () => {
    const cookieStr = cookies.setCookie(testName, testValue, 1);
    expect(cookieStr).toContain("expires=");
    expect(cookieStr).toContain(`${testName}=${testValue}`);
  });

  test("setCookie sets session cookie if days not provided", () => {
    cookies.setCookie(testName, testValue);
    expect(document.cookie).toMatch(new RegExp(`${testName}=${testValue}`));
  });
});
