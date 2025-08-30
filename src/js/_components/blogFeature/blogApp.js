/**
 * @file blogApp.js
 */
import AppContract from "../../_contracts/appContract";
import BlogPostService from "./blogPostService";
import createBlogRepository from "./blogRepositoryFactory";
import BlogRepositoryContext from "./blogRepositoryContext";
import EventBus from "./eventBus";
import cookies from "./cookies";

const eventBus = EventBus.getInstance();
const COOKIE_NAME = "storageStrategy";
const COOKIE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export default class BlogApp extends AppContract {
  #ready;
  #postCreated;
  #repositoryCache = {};

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
      const res = cookies.getCookie(COOKIE_NAME);
      const savedStrategy = res ? JSON.parse(res) : { strategy: "memory" };
      const repoInstance = this.getOrCreateRepository(savedStrategy.strategy);
      const repoContext = new BlogRepositoryContext(repoInstance);
      this.service = new BlogPostService(repoContext);
      eventBus.emit("switch-strategy", savedStrategy);
    }

    this.init();
  }

  getOrCreateRepository(strategyName) {
    if (!this.#repositoryCache[strategyName]) {
      this.#repositoryCache[strategyName] = createBlogRepository(strategyName);
    }
    return this.#repositoryCache[strategyName];
  }

  async setStrategy(strategyName) {
    const repoInstance = this.getOrCreateRepository(strategyName);
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
    const value = JSON.stringify(strategyName);
    cookies.setCookie(COOKIE_NAME, value, COOKIE_DURATION);
    await this.setStrategy(e.detail.strategy);
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
