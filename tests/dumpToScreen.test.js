import { jest } from "@jest/globals";
import DumpToScreen from "../src/js/_lib/dumpToScreen";
import MatrixPrinter from "../src/js/_lib/matrixPrinter";

describe("DumpToScreen", () => {
  let element;

  beforeEach(() => {
    element = document.createElement("div");
    element.id = "test-panel";
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  test("displays messages instantly", () => {
    const logger = new DumpToScreen("test-panel");
    
    logger.log("Hello");
    expect(element.innerHTML).toBe("<p>Hello</p>");
    
    logger.log("World");
    expect(element.innerHTML).toBe("<p>Hello</p><p>World</p>");
  });

  test("respects queue length limit", () => {
    const logger = new DumpToScreen("test-panel", 2);
    
    logger.log("First");
    logger.log("Second");
    logger.log("Third");
    
    expect(element.innerHTML).toBe("<p>Second</p><p>Third</p>");
  });

  test("animates messages character by character", async () => {
    jest.useFakeTimers();
    const printer = new MatrixPrinter(10);
    const logger = new DumpToScreen("test-panel", 4, printer);
    
    logger.logAnimated("Hi");
    
    expect(element.innerHTML).toBe("<p></p>");
    
    await jest.advanceTimersByTimeAsync(10);
    expect(element.innerHTML).toBe("<p>H</p>");
    
    await jest.advanceTimersByTimeAsync(10);
    expect(element.innerHTML).toBe("<p>Hi</p>");
    
    jest.useRealTimers();
  });

  test("animated messages persist after completion", async () => {
    jest.useFakeTimers();
    const printer = new MatrixPrinter(10);
    const logger = new DumpToScreen("test-panel", 4, printer);
    
    logger.logAnimated("Test");
    await jest.advanceTimersByTimeAsync(50);
    
    logger.log("New message");
    
    expect(element.innerHTML).toBe("<p>Test</p><p>New message</p>");
    
    jest.useRealTimers();
  });

  test("throws error when element not found", () => {
    expect(() => new DumpToScreen("missing-panel")).toThrow(
      "Element with id 'missing-panel' not found."
    );
  });
});
