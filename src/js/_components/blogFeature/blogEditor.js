/**
 * @file blogEditor.js
 */
import EventBus from "./eventBus";

const eventBus = EventBus.getInstance();

export default class BlogEditor extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <form data-blog-editor-form>
        <fieldset>
          <legend>New Post</legend>
          <label for="title">Title:</label>
            <input type="text" name="title" required />
          </label>
          <label for="content">Content:</label>
            <textarea name="content" required></textarea>
          </label>
          <button type="submit" class="button">Save</button>
        </fieldset>
      </form>
    `;

    const form = this.querySelector("[data-blog-editor-form]");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = this.querySelector("input[name='title']").value.trim();
      const content = this.querySelector(
        "textarea[name='content']",
      ).value.trim();
      if (!title || !content) {
        // Optionally show a local error, but do not emit event
        return;
      }
      eventBus.emit("post-created", { title, content });
      form.reset();
    });
  }
}
