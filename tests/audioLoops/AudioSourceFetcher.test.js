import { jest } from "@jest/globals";
import AudioSourceFetcher from "../../src/js/_components/audioLoops/utils/AudioSourceFetcher";

describe("AudioSourceFetcher", () => {
  let fetcher;
  let mockAudioContext;
  let decodeAudioDataMock;

  const testUrl = "https://example.com/audio.mp3";
  const fakeArrayBuffer = new ArrayBuffer(8);
  const fakeAudioBuffer = { duration: 1.23 };

  beforeEach(() => {
    decodeAudioDataMock = jest.fn().mockResolvedValue(fakeAudioBuffer);
    mockAudioContext = { decodeAudioData: decodeAudioDataMock };
    fetcher = new AudioSourceFetcher(mockAudioContext);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(fakeArrayBuffer),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetches and decodes audio, then caches the result", async () => {
    const buffer = await fetcher.fetch(testUrl);
    expect(global.fetch).toHaveBeenCalledWith(testUrl);
    expect(decodeAudioDataMock).toHaveBeenCalledWith(fakeArrayBuffer);
    expect(buffer).toBe(fakeAudioBuffer);

    // Second call should use cache, not fetch or decode again
    global.fetch.mockClear();
    decodeAudioDataMock.mockClear();
    const cachedBuffer = await fetcher.fetch(testUrl);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(decodeAudioDataMock).not.toHaveBeenCalled();
    expect(cachedBuffer).toBe(fakeAudioBuffer);
  });

  it("throws and logs an error if fetch fails", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await expect(fetcher.fetch(testUrl)).rejects.toThrow(
      "Failed to fetch audio: 404 Not Found",
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("AudioSourceFetcher error"),
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it("throws and logs an error if decodeAudioData fails", async () => {
    decodeAudioDataMock.mockRejectedValueOnce(new Error("decode failed"));
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await expect(fetcher.fetch(testUrl)).rejects.toThrow("decode failed");
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("AudioSourceFetcher error"),
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it("can clear cache for a specific URL", async () => {
    await fetcher.fetch(testUrl);
    expect(fetcher.cache.has(testUrl)).toBe(true);
    fetcher.clearCache(testUrl);
    expect(fetcher.cache.has(testUrl)).toBe(false);
  });

  it("can clear cache", async () => {
    await fetcher.fetch(testUrl);
    fetcher.cache.set("another-url", fakeAudioBuffer);
    expect(fetcher.cache.size).toBe(2);
    fetcher.clearCache();
    expect(fetcher.cache.size).toBe(0);
  });
});
