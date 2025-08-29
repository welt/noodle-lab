/* eslint-disable no-unused-vars */
/**
 * Repository Contract Interface
 * @file RepositoryContract.js
 */
export default class RepositoryContract {
  /**
   * Add a new entity.
   * @param {Object} entity
   * @returns {Promise<any>}
   */
  async add(entity) {
    throw new Error("Not implemented");
  }

  /**
   * Get an entity by its ID.
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    throw new Error("Not implemented");
  }

  /**
   * Update an existing entity.
   * @param {Object} entity
   * @returns {Promise<any>}
   */
  async update(entity) {
    throw new Error("Not implemented");
  }

  /**
   * Delete an entity by its ID.
   * @param {string|number} id
   * @returns {Promise<any>}
   */
  async delete(id) {
    throw new Error("Not implemented");
  }

  /**
   * Get all entities.
   * @returns {Promise<Array<Object>>}
   */
  async getAll() {
    throw new Error("Not implemented");
  }
}
