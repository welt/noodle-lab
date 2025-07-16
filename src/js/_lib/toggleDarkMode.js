/**
 * Toggles 'dark-mode' CSS.
 */
const eventsAllowed = ["toggle-button"];

const defaults = {
  events: eventsAllowed,
};

const checkAllowedEvents = (events) => {
  if (!Array.isArray(events))
    throw new TypeError("Events must be an array of strings.");
  events.forEach((event) => {
    if (!eventsAllowed.includes(event)) {
      throw new TypeError(
        `Event "${event}" is not allowed. Allowed events are: ${eventsAllowed.join(", ")}`,
      );
    }
  });
};

/**
 * @param {Object} options
 * @param {string[]} [options.events] - Allowed events.
 */
export default function ToggleDarkMode(options = {}) {
  if (options.events) {
    checkAllowedEvents(options.events);
  }
  this.options = { ...defaults, ...options };
}

ToggleDarkMode.prototype.setMode = function (event) {
  if ("checked" in event.detail) {
    document.documentElement.classList.toggle("dark-mode");
    const mode = document.documentElement.classList.contains("dark-mode")
      ? "dark"
      : "light";
    localStorage.setItem("mode", mode);
  }
};

ToggleDarkMode.prototype.bindEvents = function () {
  this.options.events.forEach((event) => {
    document.addEventListener(event, this.setMode.bind(this));
  });
};

ToggleDarkMode.prototype.init = function () {
  this.bindEvents();
  const storedMode = localStorage.getItem("mode");
  if (storedMode === "dark") {
    document.documentElement.classList.add("dark-mode");
    return;
  }
  document.documentElement.classList.remove("dark-mode");
};
