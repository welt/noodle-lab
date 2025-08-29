/**
 * @file blogRepositoryStrategy.js
 */
import BlogPostRepositoryInMemory from "./blogPostRepositoryInMemory.js";
import BlogPostRepositoryIndexDB from "./blogPostRepositoryIndexDB.js";

const strategiesAllowed = {
  memory: () => new BlogPostRepositoryInMemory(),
  indexDB: () => new BlogPostRepositoryIndexDB(),
  default: () => new BlogPostRepositoryInMemory(),
};

const blogRepositoryStrategy = (strategy) => {
  const strategyName = strategy || "default";
  const strategyFn =
    strategiesAllowed[strategyName] || strategiesAllowed["default"];
  return strategyFn();
};

export default blogRepositoryStrategy;
