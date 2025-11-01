/**
 * @file screenLogger.js
 * Proxies console.log() so that messages containing
 * specified substrings, eg. "cached", are also logged to screen.
 * @param {Logger} DumpToScreenClass
 * @param {String} elementId - DOM id of the element to log messages to
 * @returns {Function}
 */
import MatrixPrinter from "./matrixPrinter";

const matrixTimeOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

export default function createScreenLogger(DumpToScreenClass, elementId) {
  const screenDumper = new DumpToScreenClass(elementId);

  screenDumper.setPrinter(new MatrixPrinter());

  const originalConsoleLog = console.log;

  const stringsAllowed = [
    "cached",
    "fetched",
    "created",
    "errored",
    "Call trans opt: received",
  ];

  const isScreenMethod = (str) => {
    if (typeof str !== "string") return false;
    return stringsAllowed.some((allowedStr) =>
      str.toLowerCase().includes(allowedStr),
    );
  };

  const matrixMessage = () => {
    const currentDate = new Date().toLocaleString("en-US", matrixTimeOptions);
    return `Call trans opt: received. ${currentDate} REC:Log>`;
  };

  console.log = new Proxy(originalConsoleLog, {
    apply: function (target, thisArg, argumentsList) {
      const [str] = argumentsList;
      if (isScreenMethod(str)) {
        screenDumper.log(str);
      }
      if (Math.random() < 0.2) {
        screenDumper.logAnimated(matrixMessage());
      }
      return Reflect.apply(target, thisArg, argumentsList);
    },
  });

  return console.log;
}
