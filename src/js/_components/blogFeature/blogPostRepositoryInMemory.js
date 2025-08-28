/**
 * @file blogPostRepositoryInMemory.js
 * In-memory BlogPostRepository implementation.
 */
import BlogPost from "./blogPost.js";
import RepositoryContract from "../../_contracts/repositoryContract.js";

export default class BlogPostRepositoryInMemory extends RepositoryContract {
  constructor() {
    super();
    this.posts = new Map();
  }

  async addPost(post) {
    const blogPost = post instanceof BlogPost ? post : new BlogPost(post);
    this.posts.set(blogPost.id, blogPost);
    return blogPost;
  }

  async getPostById(id) {
    const post = this.posts.get(id);
    return post ? new BlogPost(post) : null;
  }

  async updatePost(post) {
    if (!this.posts.has(post.id)) {
      return null;
    }
    const blogPost = post instanceof BlogPost ? post : new BlogPost(post);
    this.posts.set(blogPost.id, blogPost);
    return blogPost;
  }

  async deletePost(id) {
    return this.posts.delete(id);
  }

  async getAllPosts() {
    return Array.from(this.posts.values()).map((obj) => new BlogPost(obj));
  }

  // --- Test Utilities ---

  async clearAll() {
    this.posts.clear();
  }

  async deleteDatabase() {
    this.posts.clear();
  }

  // --- Contract Methods (for compatibility) ---

  async add(entity) {
    return this.addPost(entity);
  }

  async getById(id) {
    return this.getPostById(id);
  }

  async update(entity) {
    return this.updatePost(entity);
  }

  async delete(id) {
    return this.deletePost(id);
  }

  async getAll() {
    return this.getAllPosts();
  }
}
