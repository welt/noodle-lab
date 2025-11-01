import Message from "../src/js/_lib/message";

describe("Message", () => {
  test("creates regular message from string", () => {
    const msg = Message.from("Hello");

    expect(msg.messageText).toBe("Hello");
    expect(msg.shouldAnimate).toBe(false);
    expect(msg.currentDisplay).toBe("Hello");
  });

  test("creates animated message when specified", () => {
    const msg = Message.from("Test", true);

    expect(msg.messageText).toBe("Test");
    expect(msg.shouldAnimate).toBe(true);
    expect(msg.currentDisplay).toBe("");
  });

  test("returns Message object unchanged", () => {
    const original = new Message("Test", true);
    const result = Message.from(original);

    expect(result).toBe(original);
  });

  test("tracks animation state", () => {
    const msg = new Message("Test", true);

    expect(msg.animationStarted).toBe(false);

    msg.animationStarted = true;
    expect(msg.animationStarted).toBe(true);
  });
});
