/* eslint-disable no-unused-vars */
/**
 * @file blogRepositoryFactory.js
 */
import RepositoryContract from "../../_contracts/repositoryContract.js";
import BlogPostRepositoryInMemory from "./blogPostRepositoryInMemory.js";
import BlogPostRepositoryIndexDB from "./blogPostRepositoryIndexDB.js";

const strategiesAllowed = {
  memory: () => new BlogPostRepositoryInMemory(),
  indexDB: () => new BlogPostRepositoryIndexDB(),
  default: () => new BlogPostRepositoryIndexDB(),
};

/**
 * Creates a blog repository instance from strategy name.
 * @param {string} strategy - Name of strategy
 * @returns {RepositoryContract} - Instance of a repository.
 */
export default function createBlogRepository(strategy) {
  const strategyName = strategy || "default";
  const strategyFn =
    strategiesAllowed[strategyName] || strategiesAllowed["default"];
  return strategyFn();
}
/* eslint-enable no-unused-vars */
