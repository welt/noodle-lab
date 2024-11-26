import randomProperty from "../src/js/_lib/randomProperty";

describe("Test randomProperty() function", () => {
  test("It should return an object with a single key-value pair from the input object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = randomProperty(obj);
    const keys = Object.keys(result);
    expect(keys.length).toBe(1);
    expect(obj[keys[0]]).toBe(result[keys[0]]);
  });

  test("It should return an empty object for an empty input object", () => {
    const obj = {};
    const result = randomProperty(obj);
    expect(result).toEqual({});
  });

  test("It should return a single key-value pair for a single-property object", () => {
    const obj = { a: 1 };
    const result = randomProperty(obj);
    expect(result).toEqual({ a: 1 });
  });
});
