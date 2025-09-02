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

const blogRepositoryStrategy = (strategyName) => {
  const name = strategyName || "default";
  const strategyFn = strategiesAllowed[name] || strategiesAllowed["default"];
  return strategyFn();
};

export default blogRepositoryStrategy;
