import Cache from "../src/js/_contracts/cache";

const testUri = "https://test.example.com";

describe("Test the Cache abstract class", () => {
  test("It does not allow instantiation", () => {
    expect(() => new Cache()).toThrow(
      "Cannot instantiate abstract Cache class directly.",
    );
  });

  test("It throws errors if its methods are not overridden", () => {
    class TestCache extends Cache {}
    const instance = new TestCache();
    expect(() => instance.getCachedData(testUri)).toThrow(
      "Method 'getCachedData(uri)' should be overridden in subclass.",
    );
    expect(() => instance.setCachedData(testUri, {})).toThrow(
      "Method 'setCachedData(uri, data)' should be overridden in subclass.",
    );
  });
});
