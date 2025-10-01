/**
 * @file blogRepositoryFactory.test.js
 */
import createBlogRepository from "../../src/js/_components/blogFeature/blogRepositoryFactory.js";
import BlogRepositoryContext from "../../src/js/_components/blogFeature/blogRepositoryContext.js";
import BlogPostRepositoryInMemory from "../../src/js/_components/blogFeature/blogPostRepositoryInMemory.js";
import BlogPostRepositoryIndexDB from "../../src/js/_components/blogFeature/blogPostRepositoryIndexDB.js";

describe("createBlogRepository (factory)", () => {
  test("returns BlogPostRepositoryInMemory for 'memory' strategy", () => {
    const repo = createBlogRepository("memory");
    expect(repo).toBeInstanceOf(BlogPostRepositoryInMemory);
  });

  test("returns BlogPostRepositoryIndexDB for 'indexDB' strategy", () => {
    const repo = createBlogRepository("indexDB");
    expect(repo).toBeInstanceOf(BlogPostRepositoryIndexDB);
  });

  test("returns BlogPostRepositoryInMemory for unknown strategy (default)", () => {
    const repo = createBlogRepository("unknown");
    expect(repo).toBeInstanceOf(BlogPostRepositoryInMemory);
  });

  test("returns BlogPostRepositoryInMemory when called with no argument", () => {
    const repo = createBlogRepository();
    expect(repo).toBeInstanceOf(BlogPostRepositoryInMemory);
  });
});

describe("BlogRepositoryContext runtime strategy swapping", () => {
  let repoCache, context;

  beforeEach(() => {
    repoCache = {
      memory: createBlogRepository("memory"),
      indexDB: createBlogRepository("indexDB"),
    };
    context = new BlogRepositoryContext(repoCache.memory);
  });

  test("delegates to initial strategy", async () => {
    const post = { id: "1", title: "Test", content: "Content" };
    await context.addPost(post);
    const fetched = await context.getPostById("1");
    expect(fetched.title).toBe("Test");
    expect(fetched.content).toBe("Content");
  });

  test("can swap strategy at runtime", async () => {
    await context.addPost({ id: "2", title: "Memory", content: "Repo" });
    let fetched = await context.getPostById("2");
    expect(fetched.title).toBe("Memory");

    context.setStrategy(repoCache.indexDB);
    const missing = await context.getPostById("2");
    expect(missing).toBeNull();

    await context.addPost({ id: "3", title: "IndexDB", content: "Repo" });
    fetched = await context.getPostById("3");
    expect(fetched.title).toBe("IndexDB");
  });

  test("strategy swap does not affect previous repository state", async () => {
    await context.addPost({ id: "4", title: "First", content: "Memory" });
    context.setStrategy(repoCache.indexDB);
    await context.addPost({ id: "5", title: "Second", content: "IndexDB" });

    // Switch back to memory and verify persistence
    context.setStrategy(repoCache.memory);
    const memPost = await context.getPostById("4");
    expect(memPost.title).toBe("First");
    const memMissing = await context.getPostById("5");
    expect(memMissing).toBeNull();

    // Switch to indexDB and verify persistence
    context.setStrategy(repoCache.indexDB);
    const idxPost = await context.getPostById("5");
    expect(idxPost.title).toBe("Second");
    const idxMissing = await context.getPostById("4");
    expect(idxMissing).toBeNull();
  });
});
