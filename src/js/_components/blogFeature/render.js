/**
 * @file render.js
 * Utility to render a message (object or string)
 */
import formatTimestamp from "../../_lib/formatTimestamp";

/**
 * Erase contents of an element.
 * @param {HTMLElement} el - Element to erase contents from.
 */
export const eraseContents = (el) => {
  while (el?.firstChild) el.removeChild(el.firstChild);
};

/**
 * Render HTML tags into a container element.
 * @param {object} tagMap - Map of tag names : text content.
 * @param {HTMLElement} container - Element to render content into.
 */
export const renderTags = (tagMap, container) => {
  Object.entries(tagMap).forEach(([tag, text]) => {
    if (text) {
      const el = Object.assign(document.createElement(tag), {
        textContent:
          tag === "time" ? `Posted on ${formatTimestamp(text)}` : text,
      });
      if (tag === "time") el.dateTime = text;
      container.appendChild(el);
    }
  });
};

/**
 * Renders a message into a container element.
 * @param {HTMLElement} container - Element to render content into.
 * @param {object|string} message - Message to render.
 */
export const render = (container, message) => {
  if (!container) return;

  eraseContents(container);

  if (typeof message === "object" && message !== null) {
    const tags = {
      h3: message.title,
      p: message.content,
      time: message.createdAt,
    };
    renderTags(tags, container);
  }

  if (typeof message === "string") {
    const tags = {
      p: message,
    };
    renderTags(tags, container);
  }
};
