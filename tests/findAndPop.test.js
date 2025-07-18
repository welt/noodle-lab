import findAndPop from "../src/js/_lib/findAndPop";

describe("findAndPop", () => {
  test("It removes and returns the found element", () => {
    const arr = ["a", "b", "c"];
    const result = findAndPop(arr, "b");
    expect(result).toBe("b");
    expect(arr).toEqual(["a", "c"]);
  });

  test("It returns null if the element is not found", () => {
    const arr = ["x", "y", "z"];
    const result = findAndPop(arr, "not-there");
    expect(result).toBeNull();
    expect(arr).toEqual(["x", "y", "z"]);
  });

  test("It works with numbers and mutates the array", () => {
    const arr = [1, 2, 3, 4];
    const result = findAndPop(arr, 3);
    expect(result).toBe(3);
    expect(arr).toEqual([1, 2, 4]);
  });

  test("It removes only the first matching element", () => {
    const arr = ["foo", "bar", "foo"];
    const result = findAndPop(arr, "foo");
    expect(result).toBe("foo");
    expect(arr).toEqual(["bar", "foo"]);
  });
});
