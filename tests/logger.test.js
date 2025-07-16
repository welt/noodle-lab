import Logger from "../src/js/_contracts/logger";

describe("Test the Logger is an abstract class", () => {
  test("It does not allow instantiation", () => {
    expect(() => new Logger()).toThrow(
      "Cannot instantiate abstract Logger class directly.",
    );
  });

  test("It throws an error if its method is not overridden", () => {
    class TestLogger extends Logger {}
    const instance = new TestLogger();
    expect(() => instance.log("Test message")).toThrow(
      "Method 'log(str)' should be overridden in the subclass.",
    );
  });
});
