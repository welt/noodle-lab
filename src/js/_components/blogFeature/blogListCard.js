/**
 * @file blogListCard.js
 */

const styles = ["blog-list-card", "card", "grid-item"];

export default class BlogListCard extends HTMLElement {
  #list;

  connectedCallback() {
    this.classList.add(...styles);
    this.render();
    this.#list = this.querySelector("blog-list");
  }

  render() {
    this.innerHTML = `
        <h2>Posts</h2>
        <blog-list></blog-list>
     `;
  }

  renderPosts(posts) {
    this.#list.renderPosts(posts);
  }
}
