import {
  DistributionUniform,
  DistributionGaussian,
} from "./distributionStrategy.js";

const distributionStrategies = {
  uniform: new DistributionUniform(),
  gaussian: new DistributionGaussian(),
};

const defaultOptions = {
  delay: 5,
  batchSize: 200,
  colourMode: "dark",
  strategy: "gaussian",
  manglePercentage: 35,
};

const colourModes = {
  light: function* () {
    while (true) {
      const grey = Math.floor(Math.random() * 256);
      yield [grey, grey, grey];
    }
  },
  dark: function* () {
    while (true) {
      yield [
        Math.floor(Math.random() * 180),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 180),
      ];
    }
  },
};

self.onmessage = async function (event) {
  const options = { ...defaultOptions, ...event.data };
  const {
    width,
    height,
    delay,
    batchSize,
    colourMode,
    manglePercentage,
    strategy,
  } = options;
  const totalPixels = width * height;
  const modifyCount = Math.round((totalPixels * manglePercentage) / 100);
  const distribution = distributionStrategies[strategy];

  if (!distribution) {
    postMessage({
      type: "error",
      message: `Unknown distribution strategy: ${strategy}`,
    });
    return;
  }

  postMessage({
    type: "start",
    totalPixels,
    modifyCount,
    colourMode,
    distribution: distribution.name,
  });

  const pixelPositions = distribution.generate({
    totalPixels,
    modifyCount,
    width,
    height,
  });
  const colourGen = colourModes[colourMode]?.() || colourModes["dark"]();
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let start = 0; start < modifyCount; start += batchSize) {
    const end = Math.min(start + batchSize, modifyCount);
    const updates = [];
    for (let k = start; k < end; k++) {
      const pixIdx = pixelPositions[k];
      const [r, g, b] = colourGen.next().value;
      updates.push({ index: pixIdx, r, g, b });
    }

    postMessage({ type: "batch", updates });
    await sleep(delay);
  }

  postMessage({ type: "done" });
};
