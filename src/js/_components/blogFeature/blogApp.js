/**
 * @file blogApp.js
 */
import AppContract from "../../_contracts/appContract";
import BlogPostService from "./blogPostService";
import createBlogRepository from "./blogRepositoryFactory";
import BlogRepositoryContext from "./blogRepositoryContext";
import EventBus from "./eventBus";

const eventBus = EventBus.getInstance();

export default class BlogApp extends AppContract {
  #ready;
  #postCreated;

  get ready() {
    return this.#ready;
  }

  get postCreated() {
    return this.#postCreated;
  }

  constructor({ listCard, editorCard, modal, service }) {
    super();
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

    this.init();
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

  async #onPostCreated(e) {
    const { title, content } = e.detail || {};
    if (!title || !content) {
      this.modal.show("Title and content are required.");
      return;
    }
    try {
      this.#postCreated = this.service
        .createPost({ title, content })
        .then(() => this.service.listPosts())
        .then((posts) => this.listCard.renderPosts(posts))
        .catch((err) => {
          this.modal.show(
            err.message || "An error occurred during post creation",
          );
        });
      await this.#postCreated;
    } catch (err) {
      this.modal.show(err.message || "An error occurred during post creation");
    }
  }

  #onPostSelected(e) {
    this.modal.show(e.detail);
  }

  async #onSwitchStrategy(e) {
    const strategyName = e.detail;
    await this.setStrategy(strategyName);
  }

  init() {
    eventBus.on("post-created", this.#onPostCreated.bind(this));
    eventBus.on("post-selected", this.#onPostSelected.bind(this));
    eventBus.on("switch-strategy", this.#onSwitchStrategy.bind(this));

    this.#ready = this.service.listPosts().then((posts) => {
      this.listCard.renderPosts(posts);
    });
  }

  destroy() {
    eventBus.off("post-created", this.#onPostCreated);
    eventBus.off("post-selected", this.#onPostSelected);
    eventBus.off("switch-strategy", this.#onSwitchStrategy);

    this.listCard = null;
    this.editorCard = null;
    this.modal = null;
    this.service = null;
  }
}
