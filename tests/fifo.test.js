import { jest } from "@jest/globals";
import Fifo from "../src/js/_lib/fifo";

describe("Fifo", () => {
  test("constructor sets maxLength and initial elements", () => {
    const q = new Fifo(2, "a", "b");
    expect(q.length).toBe(2);
    expect(q.toArray()).toEqual(["a", "b"]);
  });

  test("default maxLength is used if not provided", () => {
    const q = new Fifo();
    expect(q.length).toBe(0);
    expect(q.toArray()).toEqual([]);
  });

  test("push adds elements and shifts when exceeding maxLength", () => {
    const q = new Fifo(2);
    q.push("a");
    q.push("b");
    expect(q.toArray()).toEqual(["a", "b"]);
    q.push("c");
    expect(q.toArray()).toEqual(["b", "c"]);
  });

  test("shift removes and returns first element", () => {
    const q = new Fifo(3, "x", "y", "z");
    expect(q.shift()).toBe("x");
    expect(q.toArray()).toEqual(["y", "z"]);
  });

  test("length getter returns correct length", () => {
    const q = new Fifo(3, 1, 2, 3);
    expect(q.length).toBe(3);
  });

  test("length setter throws error", () => {
    const q = new Fifo(3);
    expect(() => {
      q.length = 10;
    }).toThrow("Property 'length' is read-only.");
  });

  test("Symbol.iterator iterates over elements", () => {
    const q = new Fifo(3, "a", "b");
    const arr = [];
    for (const el of q) arr.push(el);
    expect(arr).toEqual(["a", "b"]);
  });

  test("toString returns string representation", () => {
    const q = new Fifo(3, "a", "b");
    expect(q.toString()).toBe("a,b");
  });

  test("toArray returns array of elements", () => {
    const q = new Fifo(3, "a", "b");
    expect(q.toArray()).toEqual(["a", "b"]);
  });

  test("pop throws error", () => {
    const q = new Fifo(3);
    expect(() => q.pop()).toThrow("Method not implemented.");
  });

  test("unshift throws error", () => {
    const q = new Fifo(3);
    expect(() => q.unshift()).toThrow("Method not implemented.");
  });
});
