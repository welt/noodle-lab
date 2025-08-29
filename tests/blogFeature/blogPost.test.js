import { jest } from "@jest/globals";
import BlogPost from "../../src/js/_components/blogFeature/blogPost.js";

describe("BlogPost", () => {
  it("should create a BlogPost with correct properties", () => {
    const now = new Date().toISOString();
    const post = new BlogPost({
      id: "abc123",
      title: "Test Title",
      content: "Test Content",
      createdAt: now,
    });

    expect(post.id).toBe("abc123");
    expect(post.title).toBe("Test Title");
    expect(post.content).toBe("Test Content");
    expect(post.createdAt).toBe(now);
  });

  it("should handle missing optional properties gracefully", () => {
    const post = new BlogPost({
      id: "xyz",
      title: "",
      content: "",
      createdAt: null,
    });
    expect(post.id).toBe("xyz");
    expect(post.title).toBe("");
    expect(post.content).toBe("");
    expect(post.createdAt).toBeNull();
  });
});
