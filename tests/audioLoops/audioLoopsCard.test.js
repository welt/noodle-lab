import { jest } from "@jest/globals";
import {
  AudioLoopsController,
  AudioLoopsCard,
  AudioLoopsApp,
} from "../../src/js/_components/audioLoops";

describe("<audio-loops-card> custom element", () => {
  beforeAll(() => {
    if (!customElements.get("audio-loops-card")) {
      customElements.define("audio-loops-card", AudioLoopsCard);
    }
  });

  test("<audio-loops-card> is a registered custom element", () => {
    expect(customElements.get("audio-loops-card")).toBe(AudioLoopsCard);
  });
});

describe("AudioLoopsCard event delegation and actions", () => {
  let card;
  let controller;

  beforeEach(() => {
    document.body.innerHTML = "";
    card = document.createElement("audio-loops-card");
    document.body.appendChild(card);

    controller = {
      getState: jest.fn().mockReturnValue({}),
      play: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      stop: jest.fn(),
    };
    card.setController(controller);
  });

  it("delegates play/pause/stop actions to the controller", async () => {
    controller.getState.mockReturnValue({});
    const playBtn = card.querySelector(
      'button[data-action="togglePlay"][data-source="carillon"]',
    );
    playBtn.click();
    expect(controller.play).toHaveBeenCalledWith("carillon");

    controller.getState.mockReturnValue({ isPlaying: true });
    playBtn.click();
    expect(controller.pause).toHaveBeenCalledWith("carillon");

    controller.getState.mockReturnValue({ pauseTime: 1 });
    playBtn.click();
    expect(controller.resume).toHaveBeenCalledWith("carillon");

    const stopBtn = card.querySelector(
      'button[data-action="stop"][data-source="carillon"]',
    );
    stopBtn.click();
    expect(controller.stop).toHaveBeenCalledWith("carillon");
  });

  it("updates play/pause button label and aria attributes correctly", async () => {
    const playBtn = card.querySelector(
      'button[data-action="togglePlay"][data-source="carillon"]',
    );

    controller.getState.mockReturnValue({});
    await playBtn.click();
    expect(playBtn.textContent).toBe("Pause");
    expect(playBtn.getAttribute("aria-pressed")).toBe("true");

    controller.getState.mockReturnValue({ isPlaying: true });
    await playBtn.click();
    expect(playBtn.textContent).toBe("Play");
    expect(playBtn.getAttribute("aria-pressed")).toBe("false");

    controller.getState.mockReturnValue({ pauseTime: 1 });
    await playBtn.click();
    expect(playBtn.textContent).toBe("Pause");
    expect(playBtn.getAttribute("aria-pressed")).toBe("true");
  });

  it("updates the correct play/pause button when stop is clicked for multi-source", async () => {
    card.innerHTML += `
      <button id="toggle-bells"
              data-action="togglePlay"
              data-source="bells"
              aria-pressed="false">Play Bells</button>
      <button id="stop-bells"
              data-action="stop"
              data-source="bells">Stop Bells</button>
    `;
    const bellsPlayBtn = card.querySelector(
      'button[data-action="togglePlay"][data-source="bells"]',
    );
    const bellsStopBtn = card.querySelector(
      'button[data-action="stop"][data-source="bells"]',
    );

    bellsStopBtn.click();
    expect(controller.stop).toHaveBeenCalledWith("bells");
    expect(bellsPlayBtn.textContent).toBe("Play");
    expect(bellsPlayBtn.getAttribute("aria-pressed")).toBe("false");
  });
});
