import { jest } from "@jest/globals";
import MatrixPrinter from "../src/js/_lib/matrixPrinter";

describe("MatrixPrinter", () => {
  test("prints text character by character", async () => {
    jest.useFakeTimers();
    const printer = new MatrixPrinter(10);
    const callback = jest.fn();

    printer.print("Hi", callback);

    await jest.advanceTimersByTimeAsync(10);
    expect(callback).toHaveBeenCalledWith("H");

    await jest.advanceTimersByTimeAsync(10);
    expect(callback).toHaveBeenCalledWith("Hi");

    jest.useRealTimers();
  });

  test("resolves with complete message", async () => {
    jest.useFakeTimers();
    const printer = new MatrixPrinter(10);
    
    const promise = printer.print("Test", jest.fn());
    await jest.advanceTimersByTimeAsync(40);
    
    const result = await promise;
    expect(result).toBe("Test");
    
    jest.useRealTimers();
  });

  test("cancels previous animation when starting new one", async () => {
    jest.useFakeTimers();
    const printer = new MatrixPrinter(10);
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    printer.print("First", callback1);
    await jest.advanceTimersByTimeAsync(20);
    
    printer.print("Second", callback2);
    await jest.advanceTimersByTimeAsync(10);

    expect(callback1).toHaveBeenCalledTimes(2);
    expect(callback2).toHaveBeenCalledWith("S");

    jest.useRealTimers();
  });

  test("handles custom delay", async () => {
    jest.useFakeTimers();
    const printer = new MatrixPrinter(20);
    const callback = jest.fn();

    printer.print("AB", callback);

    await jest.advanceTimersByTimeAsync(20);
    expect(callback).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(20);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });
});
