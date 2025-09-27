/**
 * @file blogEditorCard.js
 */
const styles = ["blog-editor-card", "card", "grid-item"];

export default class BlogEditorCard extends HTMLElement {
  connectedCallback() {
    this.classList.add(...styles);
    this.render();
  }

  render() {
    this.innerHTML = `
      <h2>DIY Web Log</h2>
      <p>Write your own personal blog, using IndexDB.</p>
      <blog-editor></blog-editor>
    `;
  }
}
