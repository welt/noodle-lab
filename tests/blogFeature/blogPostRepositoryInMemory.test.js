/**
 * @file blogPostRepository.memory.test.js
 */
import { jest } from "@jest/globals";
import BlogPostRepositoryInMemory from "../../src/js/_components/blogFeature/blogPostRepositoryInMemory.js";
import BlogPost from "../../src/js/_components/blogFeature/blogPost.js";

describe("In-memory BlogPostRepository", () => {
  let repo;
  const samplePost = {
    id: "abc123",
    title: "Test Title",
    content: "Test Content",
    createdAt: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    repo = new BlogPostRepositoryInMemory();
  });

  test("addPost and getPostById store and retrieve a post", async () => {
    await repo.addPost(samplePost);
    const post = await repo.getPostById(samplePost.id);
    expect(post).toBeInstanceOf(BlogPost);
    expect(post.id).toBe(samplePost.id);
    expect(post.title).toBe(samplePost.title);
    expect(post.content).toBe(samplePost.content);
  });

  test("getAllPosts returns all posts", async () => {
    await repo.addPost(samplePost);
    await repo.addPost({ ...samplePost, id: "def456", title: "Another" });
    const posts = await repo.getAllPosts();
    expect(posts.length).toBe(2);
    expect(posts[0]).toBeInstanceOf(BlogPost);
    expect(posts[1]).toBeInstanceOf(BlogPost);
  });

  test("updatePost updates an existing post", async () => {
    await repo.addPost(samplePost);
    const updated = { ...samplePost, title: "Updated Title" };
    await repo.updatePost(updated);
    const post = await repo.getPostById(samplePost.id);
    expect(post.title).toBe("Updated Title");
  });

  test("deletePost removes a post", async () => {
    await repo.addPost(samplePost);
    await repo.deletePost(samplePost.id);
    const post = await repo.getPostById(samplePost.id);
    expect(post).toBeNull();
  });

  test("clearAll removes all posts", async () => {
    await repo.addPost(samplePost);
    await repo.clearAll();
    const posts = await repo.getAllPosts();
    expect(posts.length).toBe(0);
  });

  test("contract methods work as expected", async () => {
    await repo.add(samplePost);
    const post = await repo.getById(samplePost.id);
    expect(post).toBeInstanceOf(BlogPost);

    await repo.update({ ...samplePost, title: "Contract Update" });
    const updated = await repo.getById(samplePost.id);
    expect(updated.title).toBe("Contract Update");

    await repo.delete(samplePost.id);
    const deleted = await repo.getById(samplePost.id);
    expect(deleted).toBeNull();

    await repo.add(samplePost);
    const all = await repo.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBe(1);
  });
});
