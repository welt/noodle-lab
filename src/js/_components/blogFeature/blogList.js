/**
 * @file blogList.js
 */
import EventBus from "./eventBus";

const eventBus = EventBus.getInstance();

export default class BlogList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <ul id="post-list" class="post-list"></ul>
    `;
  }

  /**
   * Render the list of posts.
   * @param {Array} posts - Array of post objects.
   */
  renderPosts(posts) {
    const list = this.querySelector("#post-list");
    list.innerHTML = "";
    posts.forEach((post) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = post.title;
      button.classList.add("clickable-text");
      button.addEventListener("click", () => {
        eventBus.emit("post-selected", post);
      });
      li.appendChild(button);
      list.appendChild(li);
    });
  }
}
