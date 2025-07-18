import { jest } from "@jest/globals";
import createScreenLogger from "../src/js/_lib/screenLogger";

describe("Test the screenLogger proxies console.log() correctly", () => {
  let originalConsoleLog;
  let originalRandom;
  let originalToLocaleString;
  let element;
  let mockLog;

  class MockDumpToScreen {
    log(msg) {
      mockLog(msg);
    }
  }

  beforeAll(() => {
    originalConsoleLog = console.log;
  });

  beforeEach(() => {
    element = document.createElement("div");
    element.id = "message-panel";
    document.body.appendChild(element);
    mockLog = jest.fn();
    createScreenLogger(MockDumpToScreen, "fake-message-panel-id");
  });

  afterEach(() => {
    const element = document.getElementById("message-panel");
    if (element) {
      document.body.removeChild(element);
    }
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  test('It should log messages containing "cached" to screen', () => {
    console.log("This is a cached message");
    expect(mockLog).toHaveBeenCalledWith("This is a cached message");
  });

  test('It should not log messages which do not contain "cached" to screen', () => {
    console.log("This is a regular message");
    expect(mockLog).not.toHaveBeenCalledWith("This is a regular message");
  });

  test("It should not send non-string messages to screen", () => {
    console.log({ loremKey: "ipsumValue" });
    expect(mockLog).not.toHaveBeenCalledWith({ loremKey: "ipsumValue" });
  });

  test("It should log a timestamped message when Math.random() < 0.2", () => {
    originalRandom = Math.random;
    originalToLocaleString = Date.prototype.toLocaleString;
    Math.random = () => 0.1;
    Date.prototype.toLocaleString = () => "07/18/25, 06:31:03";
    createScreenLogger(MockDumpToScreen, "fake-message-panel-id");
    console.log("cached: loremp ipsum");
    Math.random = originalRandom;
    Date.prototype.toLocaleString = originalToLocaleString;
    expect(
      mockLog.mock.calls.some(
        ([msg]) =>
          msg === "Call trans opt: received. 07/18/25, 06:31:03 REC:Log>",
      ),
    ).toBe(true);
  });
});
