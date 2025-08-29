import mixinApply from "../src/js/_lib/mixinApply.js";

describe("mixinApply", () => {
  it("copies mixin methods to the target class prototype", () => {
    const mixin = {
      foo() {
        return "foo";
      },
      bar() {
        return "bar";
      },
    };

    class Target {}

    mixinApply(Target, mixin);

    const instance = new Target();
    expect(instance.foo()).toBe("foo");
    expect(instance.bar()).toBe("bar");
  });

  it("applies multiple mixins from an array", () => {
    const mixinA = {
      foo() {
        return "fooA";
      },
    };
    const mixinB = {
      bar() {
        return "barB";
      },
    };

    class Target {}

    mixinApply(Target, [mixinA, mixinB]);

    const instance = new Target();
    expect(instance.foo()).toBe("fooA");
    expect(instance.bar()).toBe("barB");
  });

  it("overwrites existing methods on the target", () => {
    const mixin = {
      foo() {
        return "foo-mixin";
      },
    };

    class Target {
      foo() {
        return "foo-original";
      }
    }

    mixinApply(Target, mixin);

    const instance = new Target();
    expect(instance.foo()).toBe("foo-mixin");
  });
});
