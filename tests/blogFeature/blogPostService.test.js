/**
 * blogPostService.test.js
 */
import { jest } from "@jest/globals";
import BlogPostService from "../../src/js/_components/blogFeature/blogPostService.js";
import BlogPostRepositoryIndexDB from "../../src/js/_components/blogFeature/blogPostRepositoryIndexDB.js";
import BlogRepositoryContext from "../../src/js/_components/blogFeature/blogRepositoryContext.js";
import BlogPost from "../../src/js/_components/blogFeature/blogPost.js";
import {
  BlogPostValidationError,
  BlogPostNotFoundError,
} from "../../src/js/_components/blogFeature/errors.js";

describe("BlogPostService", () => {
  let repo;
  let repoContext;
  let service;

  beforeEach(async () => {
    const testDbName = `blogdb_test_${Date.now()}`;
    repo = new BlogPostRepositoryIndexDB(testDbName);
    repoContext = new BlogRepositoryContext(repo);
    service = new BlogPostService(repoContext);
    await repo.clearAll();
  });

  afterAll(async () => {
    await repo.deleteDatabase();
  });

  it("should create a post with valid input", async () => {
    const post = await service.createPost({ title: "Hello", content: "World" });
    expect(post).toBeInstanceOf(BlogPost);
    expect(post.title).toBe("Hello");
    expect(post.content).toBe("World");
    expect(post.id).toMatch(/^_/);
    expect(post.createdAt).toBeDefined();
  });

  it("should throw BlogPostValidationError for missing title", async () => {
    await expect(
      service.createPost({ title: "", content: "Content" }),
    ).rejects.toThrow(BlogPostValidationError);
  });

  it("should throw BlogPostValidationError for missing content", async () => {
    await expect(
      service.createPost({ title: "Title", content: "" }),
    ).rejects.toThrow(BlogPostValidationError);
  });

  it("should list all posts", async () => {
    await service.createPost({ title: "One", content: "First" });
    await service.createPost({ title: "Two", content: "Second" });
    const posts = await service.listPosts();
    expect(posts.length).toBe(2);
    expect(posts[0]).toBeInstanceOf(BlogPost);
    expect(posts[1]).toBeInstanceOf(BlogPost);
  });

  it("should get a post by id", async () => {
    const post = await service.createPost({ title: "FindMe", content: "Here" });
    const found = await service.getPost(post.id);
    expect(found).toEqual(post);
  });

  it("should throw BlogPostNotFoundError when getting non-existent post", async () => {
    await expect(service.getPost("nonexistent")).rejects.toThrow(
      BlogPostNotFoundError,
    );
  });

  describe("BlogPostService with runtime strategy swapping", () => {
    let memoryRepo, indexDbRepo, repoContext, service;

    beforeEach(async () => {
      memoryRepo = new BlogPostRepositoryIndexDB(
        `blogdb_test_mem_${Date.now()}`,
      );
      indexDbRepo = new BlogPostRepositoryIndexDB(
        `blogdb_test_idx_${Date.now()}`,
      );
      repoContext = new BlogRepositoryContext(memoryRepo);
      service = new BlogPostService(repoContext);
      await memoryRepo.clearAll();
      await indexDbRepo.clearAll();
    });

    afterAll(async () => {
      await memoryRepo.deleteDatabase();
      await indexDbRepo.deleteDatabase();
    });

    it("should delegate to initial strategy (memory)", async () => {
      const post = await service.createPost({
        title: "Memory",
        content: "Repo",
      });
      expect(post.title).toBe("Memory");
      const found = await service.getPost(post.id);
      expect(found.content).toBe("Repo");
    });

    it("should swap to indexDB strategy and not find memory post", async () => {
      const post = await service.createPost({
        title: "SwapTest",
        content: "Memory",
      });
      repoContext.setStrategy(indexDbRepo);
      await expect(service.getPost(post.id)).rejects.toThrow(
        BlogPostNotFoundError,
      );
    });

    it("should allow creating and finding posts in swapped strategy", async () => {
      repoContext.setStrategy(indexDbRepo);
      const post = await service.createPost({
        title: "IndexDB",
        content: "Repo",
      });
      const found = await service.getPost(post.id);
      expect(found.title).toBe("IndexDB");
      expect(found.content).toBe("Repo");
    });

    it("should preserve state in each strategy after multiple swaps", async () => {
      // Create in memory
      const memPost = await service.createPost({
        title: "Mem",
        content: "One",
      });
      // Swap to indexDB
      repoContext.setStrategy(indexDbRepo);
      const idxPost = await service.createPost({
        title: "Idx",
        content: "Two",
      });

      // Swap back to memory
      repoContext.setStrategy(memoryRepo);
      const foundMem = await service.getPost(memPost.id);
      expect(foundMem.title).toBe("Mem");
      await expect(service.getPost(idxPost.id)).rejects.toThrow(
        BlogPostNotFoundError,
      );

      // Swap to indexDB
      repoContext.setStrategy(indexDbRepo);
      const foundIdx = await service.getPost(idxPost.id);
      expect(foundIdx.title).toBe("Idx");
      await expect(service.getPost(memPost.id)).rejects.toThrow(
        BlogPostNotFoundError,
      );
    });

    it("should throw validation errors in both strategies", async () => {
      await expect(
        service.createPost({ title: "", content: "X" }),
      ).rejects.toThrow(BlogPostValidationError);
      repoContext.setStrategy(indexDbRepo);
      await expect(
        service.createPost({ title: "Y", content: "" }),
      ).rejects.toThrow(BlogPostValidationError);
    });
  });

  it("should update an existing post", async () => {
    const post = await service.createPost({
      title: "Old",
      content: "OldContent",
    });
    const updated = await service.updatePost(post.id, {
      title: "New",
      content: "NewContent",
    });
    expect(updated.title).toBe("New");
    expect(updated.content).toBe("NewContent");
  });

  it("should throw BlogPostNotFoundError when updating non-existent post", async () => {
    await expect(
      service.updatePost("badid", { title: "X", content: "Y" }),
    ).rejects.toThrow(BlogPostNotFoundError);
  });

  it("should delete an existing post", async () => {
    const post = await service.createPost({
      title: "DeleteMe",
      content: "Gone",
    });
    await service.deletePost(post.id);
    await expect(service.getPost(post.id)).rejects.toThrow(
      BlogPostNotFoundError,
    );
  });

  it("should throw BlogPostNotFoundError when deleting non-existent post", async () => {
    await expect(service.deletePost("missing")).rejects.toThrow(
      BlogPostNotFoundError,
    );
  });
});
