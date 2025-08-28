/**
 * @file blogApp.js
 */
import BlogPostService from "./blogPostService";
import createBlogRepository from "./blogRepositoryFactory";
import BlogRepositoryContext from "./blogRepositoryContext";
import EventBus from "./eventBus";

const eventBus = EventBus.getInstance();

export default class BlogApp {
  #ready;
  #postCreated;

  constructor({ listCard, editorCard, modal, service }) {
    this.listCard = listCard;
    this.editorCard = editorCard;
    this.modal = modal;

    if (service) {
      this.service = service;
    } else {
      const repoInstance = createBlogRepository("memory");
      const repoContext = new BlogRepositoryContext(repoInstance);
      this.service = new BlogPostService(repoContext);
    }

    eventBus.on("post-created", async (e) => {
      this.#postCreated = (async () => {
        const { title, content } = e.detail || {};
        if (!title || !content) {
          this.modal.show("Title and content are required.");
          return;
        }
        try {
          await this.service.createPost({ title, content });
          const posts = await this.service.listPosts();
          this.listCard.renderPosts(posts);
        } catch (err) {
          this.modal.show(err.message || "An error occurred");
        }
      })();
      await this.#postCreated;
    });

    eventBus.on("post-selected", (e) => {
      this.modal.show(e.detail);
    });

    eventBus.on("switch-strategy", async (e) => {
      await this.setStrategy(e.detail.strategy);
    });

    this.#ready = this.service.listPosts().then((posts) => {
      this.listCard.renderPosts(posts);
    });
  }

  async setStrategy(strategyName) {
    const repoInstance = createBlogRepository(strategyName);
    this.service.setRepository(repoInstance);
    const posts = await this.service.listPosts();
    this.listCard.renderPosts(posts);

    if (this.modal) {
      this.modal.show(`Storage strategy switched to ${strategyName}.`);
    }
  }

  get ready() {
    return this.#ready;
  }

  get postCreated() {
    return this.#postCreated;
  }
}
