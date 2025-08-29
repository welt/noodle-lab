/**
 * BlogPostRepository.test.js
 */
import { jest } from "@jest/globals";
import BlogPostRepositoryIndexDB from "../../src/js/_components/blogFeature/blogPostRepositoryIndexDB.js";
import BlogPost from "../../src/js/_components/blogFeature/blogPost.js";

describe("BlogPostRepository", () => {
  let repo;

  beforeEach(async () => {
    const testDbName = `blogdb_test_${Date.now()}`;
    repo = new BlogPostRepositoryIndexDB(testDbName);
    await repo.clearAll();
  });

  afterAll(async () => {
    await repo.deleteDatabase();
  });

  it("should add and retrieve a blog post", async () => {
    const post = new BlogPost({
      id: "1",
      title: "Hello",
      content: "World",
      createdAt: new Date().toISOString(),
    });
    await repo.addPost(post);
    const fetched = await repo.getPostById("1");
    expect(fetched).toEqual(post);
  });

  it("should update a blog post", async () => {
    const post = new BlogPost({
      id: "2",
      title: "A",
      content: "B",
      createdAt: new Date().toISOString(),
    });
    await repo.addPost(post);
    post.title = "Updated";
    await repo.updatePost(post);
    const updated = await repo.getPostById("2");
    expect(updated.title).toBe("Updated");
  });

  it("should delete a blog post", async () => {
    const post = new BlogPost({
      id: "3",
      title: "Delete",
      content: "Me",
      createdAt: new Date().toISOString(),
    });
    await repo.addPost(post);
    await repo.deletePost("3");
    const deleted = await repo.getPostById("3");
    expect(deleted).toBeNull();
  });

  it("should get all posts", async () => {
    const posts = [
      new BlogPost({
        id: "a",
        title: "One",
        content: "1",
        createdAt: new Date().toISOString(),
      }),
      new BlogPost({
        id: "b",
        title: "Two",
        content: "2",
        createdAt: new Date().toISOString(),
      }),
    ];
    await Promise.all(posts.map((post) => repo.addPost(post)));
    const all = await repo.getAllPosts();
    expect(all).toHaveLength(2);
    expect(all).toEqual(expect.arrayContaining(posts));
  });
});
