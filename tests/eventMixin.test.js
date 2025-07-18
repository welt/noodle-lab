import { jest } from "@jest/globals";
import eventMixin from "../src/js/_mixins/eventMixin";

describe("Test the eventMixin helper", () => {
  test("Its subscribe and emit methods trigger the callback", () => {
    const obj = new EventTarget();
    Object.assign(obj, eventMixin);

    const callback = jest.fn();
    obj.subscribe("test-event", callback);
    obj.emit("test-event", { foo: "bar" });

    expect(callback).toHaveBeenCalled();

    const eventArg = callback.mock.calls[0][0];
    expect(eventArg.type).toBe("test-event");
    expect(eventArg.detail).toEqual({ foo: "bar" });
  });
});
