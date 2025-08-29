/**
 * @file blogRepositoryContext.js
 */

export default class BlogRepositoryContext {
  /**
   * @param {Object} strategy - Repository strategy instance.
   */
  constructor(strategy) {
    this.setStrategy(strategy);
  }

  /**
   * @param {Object} strategy - Repository strategy instance.
   */
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  /**
   * @param {Object} post
   */
  addPost(post) {
    return this.strategy.addPost(post);
  }

  /**
   * @param {string|number} id
   */
  getPostById(id) {
    return this.strategy.getPostById(id);
  }

  /**
   * @param {Object} post
   */
  updatePost(post) {
    return this.strategy.updatePost(post);
  }

  /**
   * @param {string|number} id
   */
  deletePost(id) {
    return this.strategy.deletePost(id);
  }

  getAllPosts() {
    return this.strategy.getAllPosts();
  }

  add(entity) {
    return this.strategy.add(entity);
  }

  getById(id) {
    return this.strategy.getById(id);
  }

  update(entity) {
    return this.strategy.update(entity);
  }

  delete(id) {
    return this.strategy.delete(id);
  }

  getAll() {
    return this.strategy.getAll();
  }
}
