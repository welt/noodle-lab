/**
 * @file audioDecoder.worker.js
 * Worker for decoding audio data off the main thread
 */

let audioContext;

self.onmessage = async (event) => {
  const { id, type, arrayBuffer, sampleRate } = event.data;

  if (type === "init") {
    audioContext = new (self.AudioContext || self.webkitAudioContext)({
      sampleRate,
    });
    self.postMessage({ id, type: "init", success: true });
    return;
  }

  if (type === "decode") {
    try {
      const audioBuffer = await audioContext.decodeAudioData(
        arrayBuffer.slice(0),
      );

      const channels = [];
      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        channels.push(audioBuffer.getChannelData(i));
      }

      self.postMessage({
        id,
        type: "decode",
        success: true,
        audioBuffer: {
          numberOfChannels: audioBuffer.numberOfChannels,
          length: audioBuffer.length,
          sampleRate: audioBuffer.sampleRate,
          channels,
        },
      });
    } catch (error) {
      self.postMessage({
        id,
        type: "decode",
        success: false,
        error: error.message,
      });
    }
  }
};
