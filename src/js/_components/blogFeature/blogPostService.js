/**
 * BlogPostService.js
 */
import BlogPost from "./blogPost.js";
import { BlogPostValidationError, BlogPostNotFoundError } from "./errors.js";
import blogRepositoryStrategy from "./blogRepositoryStrategy.js";
import RepositoryContract from "../../_contracts/repositoryContract.js";
import { isDuckTypeClass } from "../../_lib/isDucktype";

const isValidRepo = (repository) =>
  isDuckTypeClass(repository?.constructor, RepositoryContract);

export default class BlogPostService {
  #repository;

  constructor(repository) {
    this.#repository = isValidRepo(repository)
      ? repository
      : blogRepositoryStrategy("memory");
  }

  setRepository(repository) {
    try {
      isValidRepo(repository);
      this.#repository = repository;
    } catch (err) {
      console.error("[BlogPostService] setRepository error:", err);
      throw err;
    }
  }

  async listPosts() {
    try {
      return await this.#repository.getAllPosts();
    } catch (err) {
      console.error("[BlogPostService] listPosts error:", err);
      throw err;
    }
  }

  async getPost(id) {
    try {
      const post = await this.#repository.getPostById(id);
      if (!post) throw new BlogPostNotFoundError("Post not found.");
      return post;
    } catch (err) {
      console.error(`[BlogPostService] getPost error (id: ${id}):`, err);
      throw err;
    }
  }

  async createPost({ title, content }) {
    try {
      if (!title || !content) {
        throw new BlogPostValidationError("Title and content are required.");
      }
      const post = new BlogPost({
        id: this.#generateUniqueId(),
        title,
        content,
        createdAt: new Date().toISOString(),
      });
      await this.#repository.addPost(post);
      return post;
    } catch (err) {
      console.error("[BlogPostService] createPost error:", err, {
        title,
        content,
      });
      throw err;
    }
  }

  async updatePost(id, { title, content }) {
    try {
      const post = await this.#repository.getPostById(id);
      if (!post) throw new BlogPostNotFoundError("Post not found.");
      post.title = title ?? post.title;
      post.content = content ?? post.content;
      await this.#repository.updatePost(post);
      return post;
    } catch (err) {
      console.error(`[BlogPostService] updatePost error (id: ${id}):`, err, {
        title,
        content,
      });
      throw err;
    }
  }

  async deletePost(id) {
    try {
      const post = await this.#repository.getPostById(id);
      if (!post) throw new BlogPostNotFoundError("Post not found.");
      await this.#repository.deletePost(id);
    } catch (err) {
      console.error(`[BlogPostService] deletePost error (id: ${id}):`, err);
      throw err;
    }
  }

  #generateUniqueId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
}
