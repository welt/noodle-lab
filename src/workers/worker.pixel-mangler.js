const MANGLE_PERCENTAGE = 35;

const defaultOptions = {
  delay: 5,
  batchSize: 200,
  colourMode: 'dark'
};

self.onmessage = async function (event) {
    const options = {...defaultOptions, ...event.data };
    const { width, height, delay, batchSize, colourMode } = options;
    const totalPixels = (width * height);
    const modifyCount = Math.round(totalPixels * MANGLE_PERCENTAGE / 100);

    postMessage({ type: 'start', totalPixels, modifyCount, colourMode });
  
    // partial Fisher-Yates to get `modifyCount` unique random indices
    const indices = Array.from({ length: totalPixels }, (_, i) => i);
    for (let i = 0; i < modifyCount; i++) {
        const j = i + Math.floor(Math.random() * (totalPixels - i));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    indices.length = modifyCount;

    const colourModes = {
        light: function*() {
            while (true) {
                const grey = Math.floor(Math.random() * 256);
                yield [grey, grey, grey];
            }
        },
        dark: function*() {
            while (true) {
                yield [
                    Math.floor(Math.random() * 180),
                    Math.floor(Math.random() * 256),
                    Math.floor(Math.random() * 180)
                ];
            }
        }
    };

    const colourGen = colourModes[colourMode]?.() || colourModes['dark']();
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    for (let start = 0; start < modifyCount; start += batchSize) {
        const end = Math.min(start + batchSize, modifyCount);
        const updates = [];
        for (let k = start; k < end; k++) {
            const pixIdx = indices[k];
            const [r, g, b] = colourGen.next().value;
            updates.push({ index: pixIdx, r, g, b });
        }
      
        postMessage({ type: 'batch', updates });
        await sleep(delay);
    }

    postMessage({ type: 'done' });
};
