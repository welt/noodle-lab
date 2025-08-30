import { jest } from "@jest/globals";
import BlogApp from "../../src/js/_components/blogFeature/blogApp.js";
import BlogEditorCard from "../../src/js/_components/blogFeature/blogEditorCard.js";
import EventBus from "../../src/js/_components/blogFeature/eventBus.js";

const eventBus = EventBus.getInstance();

if (!customElements.get("blog-editor-card")) {
  customElements.define("blog-editor-card", BlogEditorCard);
}

describe("BlogApp event handling", () => {
  let mockListCard, mockEditorCard, mockModal, mockService, blogEditor;

  beforeAll(() => {
    if (!customElements.get("blog-editor-card")) {
      customElements.define("blog-editor-card", BlogEditorCard);
    }
  });

  beforeEach(() => {
    mockListCard = document.createElement("div");
    mockListCard.renderPosts = jest.fn();

    mockEditorCard = document.createElement("blog-editor-card");
    document.body.appendChild(mockEditorCard);

    mockModal = { show: jest.fn() };
    mockService = {
      createPost: jest.fn().mockResolvedValue({}),
      listPosts: jest.fn().mockResolvedValue([]),
      setRepository: jest.fn(),
    };
    blogEditor = null;
  });

  afterEach(() => {
    if (mockEditorCard && mockEditorCard.parentNode) {
      mockEditorCard.parentNode.removeChild(mockEditorCard);
    }
  });

  // post-created
  it("should call service.createPost and refresh list when post-created is emitted", async () => {
    const app = new BlogApp({
      listCard: mockListCard,
      editorCard: mockEditorCard,
      modal: mockModal,
      service: mockService,
    });
    await app.ready;

    blogEditor = mockEditorCard.querySelector("blog-editor");
    expect(blogEditor).not.toBeNull();

    eventBus.emit("post-created", { title: "Test", content: "Body" });
    await app.postCreated;

    expect(mockService.createPost).toHaveBeenCalledWith({
      title: "Test",
      content: "Body",
    });
    expect(mockService.listPosts).toHaveBeenCalled();
    expect(mockListCard.renderPosts).toHaveBeenCalledWith([]);
  });

  // post-selected
  it("should call modal.show with post data when post-selected is emitted", async () => {
    mockModal.show = jest.fn();

    const app = new BlogApp({
      listCard: mockListCard,
      editorCard: mockEditorCard,
      modal: mockModal,
      service: mockService,
    });
    await app.ready;

    const postData = { title: "Post Title", content: "Post Content" };
    eventBus.emit("post-selected", postData);

    expect(mockModal.show).toHaveBeenCalledWith(postData);
  });

  // post list rendering
  it("should render the initial list of posts on construction", async () => {
    mockService.listPosts = jest
      .fn()
      .mockResolvedValue([{ title: "A", content: "B" }]);
    mockListCard.renderPosts = jest.fn();

    const app = new BlogApp({
      listCard: mockListCard,
      editorCard: mockEditorCard,
      modal: mockModal,
      service: mockService,
    });
    await app.ready;

    expect(mockService.listPosts).toHaveBeenCalled();
    expect(mockListCard.renderPosts).toHaveBeenCalledWith([
      { title: "A", content: "B" },
    ]);
  });

  // error modal
  it("should show error modal if service.createPost throws", async () => {
    const error = new Error("Validation failed");
    mockService.createPost = jest.fn().mockRejectedValue(error);
    mockService.listPosts = jest.fn().mockResolvedValue([]);
    mockModal.show = jest.fn();

    let postCreatedHandler;
    mockEditorCard.subscribe = jest.fn((event, handler) => {
      if (event === "post-created") postCreatedHandler = handler;
    });

    const app = new BlogApp({
      listCard: mockListCard,
      editorCard: mockEditorCard,
      modal: mockModal,
      service: mockService,
    });
    await app.ready;

    const initialListPostsCalls = mockService.listPosts.mock.calls.length;
    const initialRenderPostsCalls = mockListCard.renderPosts.mock.calls.length;

    blogEditor = mockEditorCard.querySelector("blog-editor");
    expect(blogEditor).not.toBeNull();

    eventBus.emit("post-created", { title: "Bad", content: "Data" });
    await app.postCreated;

    expect(mockModal.show).toHaveBeenCalledWith(
      expect.stringMatching(/Validation failed/),
    );

    expect(mockService.listPosts.mock.calls.length).toBe(initialListPostsCalls);
    expect(mockListCard.renderPosts.mock.calls.length).toBe(
      initialRenderPostsCalls,
    );
  });

  it("should switch repository strategy and refresh post list", async () => {
    // Override the shared mocks for this test
    mockService.setRepository = jest.fn();
    mockService.listPosts.mockResolvedValue([
      { title: "Switched", content: "Repo" },
    ]);
    mockListCard.renderPosts = jest.fn();

    const app = new BlogApp({
      listCard: mockListCard,
      editorCard: mockEditorCard,
      modal: mockModal,
      service: mockService,
    });
    await app.ready;
    await app.setStrategy("indexDB");

    expect(mockService.setRepository).toHaveBeenCalledWith(expect.anything());
    expect(mockService.listPosts).toHaveBeenCalled();
    expect(mockListCard.renderPosts).toHaveBeenCalledWith([
      { title: "Switched", content: "Repo" },
    ]);
  });

  it("should persist in-memory repository data across strategy switches", async () => {
    // Simulate real repository caching in BlogApp
    const app = new BlogApp({
      listCard: mockListCard,
      editorCard: mockEditorCard,
      modal: mockModal,
    });
    await app.ready;

    // Add a post to memory strategy
    await app.setStrategy("memory");
    await app.service.createPost({
      title: "Memory Post",
      content: "Persisted",
    });
    let posts = await app.service.listPosts();
    expect(posts.some((p) => p.title === "Memory Post")).toBe(true);

    // Switch to indexDB (posts will be different)
    await app.setStrategy("indexDB");
    posts = await app.service.listPosts();
    expect(posts.some((p) => p.title === "Memory Post")).toBe(false);

    // Switch back to memory, post should still be there
    await app.setStrategy("memory");
    posts = await app.service.listPosts();
    expect(posts.some((p) => p.title === "Memory Post")).toBe(true);
  });
});
