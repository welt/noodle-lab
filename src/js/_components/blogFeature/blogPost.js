/**
 * BlogPost.js
 */
export default class BlogPost {
  /**
   * @param {Object} params
   * @param {string|number} params.id - Unique identifier for post
   * @param {string} params.title - Title of post
   * @param {string} params.content - Content of post
   * @param {string|Date|null} params.createdAt - ISO string or Date object
   */
  constructor({ id, title, content, createdAt }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }
}
