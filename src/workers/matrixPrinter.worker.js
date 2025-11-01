/**
 * @file matrixPrinter.worker.js
 *
 * Types a message character-by-character and
 * posts message objects back to the main thread:
 *   { type: 'update', text, runId }
 *   { type: 'done', text, runId }
 *   { type: 'error', message, stack?, runId }
 *
 * Sending a new 'start' or 'stop' sets `currentRunId`
 * so the running loop exits promptly.
 */

/**
 * Identifier for the current run
 * @type {number|string|null}
 */
let currentRunId = null;

/**
 * Builds an error payload for posting to main thread
 * @param {object} err
 * @param {number|string} runId
 * @returns
 */
function makeErrorPayload(err, runId) {
  return {
    type: "error",
    message: err && err.message ? err.message : String(err),
    stack: err && err.stack ? err.stack : undefined,
    runId,
  };
}

/**
 * Tries to post a message to the main thread with errors ignored.
 * @param {object} msg
 */
function safePost(msg) {
  try {
    self.postMessage(msg);
  } catch (_) {}
}

/**
 * Yields each incremental state of the message
 * @param {string} message
 */
function* incrementalMessage(message) {
  let acc = "";
  for (const char of message) {
    acc += char;
    yield acc;
  }
}

/**
 * Prints message to main thread with incremental updates
 * @param {string} rawMessage
 * @param {number} rawDelay
 * @param {number|string} runId
 */
async function runPrint(rawMessage, rawDelay, runId) {
  const message = rawMessage == null ? "" : String(rawMessage);
  const delay = Math.max(0, Number(rawDelay) || 0);

  if (currentRunId !== runId) return;

  for (const acc of incrementalMessage(message)) {
    if (currentRunId !== runId) return;
    safePost({ type: "update", text: acc, runId });
    await new Promise((res) => setTimeout(res, delay));
    if (currentRunId !== runId) {
      safePost({ type: "update", text: "", runId });
      return;
    }
  }
  if (currentRunId === runId) {
    safePost({ type: "done", text: message, runId });
  }
}

self.addEventListener("message", (e) => {
  const payload = e && e.data ? e.data : {};
  const cmd = payload && payload.cmd;
  try {
    const commands = {
      start(payload) {
        const { message = "", delay = 50, runId } = payload;
        currentRunId = runId;
        runPrint(message, delay, runId).catch((err) => {
          safePost(makeErrorPayload(err, runId));
        });
      },
      stop() {
        currentRunId = null;
      },
    };
    const handler = commands[cmd];
    if (handler) handler(payload);
  } catch (err) {
    safePost(makeErrorPayload(err, payload && payload.runId));
  }
});
