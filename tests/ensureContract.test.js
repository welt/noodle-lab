import { jest } from "@jest/globals";
import ensureContract from "../src/js/_mixins/ensureContract.js";

class FakeClass {
  foo() {}
  bar() {}
}
const testInstance = new FakeClass();
Object.assign(testInstance, ensureContract);

describe("ensureContract", () => {
  it("passes when all methods are present on the prototype", () => {
    class TestClass {
      foo() {}
      bar() {}
    }
    const obj = new TestClass();
    expect(() =>
      testInstance.ensureContract(obj, ["foo", "bar"]),
    ).not.toThrow();
  });

  it("passes when all methods are present as own properties", () => {
    const obj = {
      foo: () => {},
      bar: () => {},
    };
    expect(() =>
      testInstance.ensureContract(obj, ["foo", "bar"]),
    ).not.toThrow();
  });

  it("throws TypeError when a method is missing", () => {
    class TestClass {
      foo() {}
    }
    const obj = new TestClass();
    expect(() => testInstance.ensureContract(obj, ["foo", "bar"])).toThrow(
      TypeError,
    );
  });

  it("throws TypeError when no methods are present", () => {
    const obj = {};
    expect(() => testInstance.ensureContract(obj, ["foo"])).toThrow(TypeError);
  });

  it("passes when methods are inherited from a parent class", () => {
    class Parent {
      foo() {}
    }
    class Child extends Parent {
      bar() {}
    }
    const obj = new Child();
    expect(() =>
      testInstance.ensureContract(obj, ["foo", "bar"]),
    ).not.toThrow();
  });
});
