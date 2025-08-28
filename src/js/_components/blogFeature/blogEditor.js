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
      <h4>New Post</h4>
      <form data-blog-editor-form>
        <input type="text" name="title" placeholder="Title" required />
        <textarea name="content" placeholder="Write your post..." required></textarea>
        <button type="submit" class="button">Save</button>
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
