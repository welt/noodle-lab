/**
 * BlogPostRepositoryIndexDB.js
 */
import BlogPost from "./blogPost.js";
import config from "./config.js";
import RepositoryContract from "../../_contracts/repositoryContract.js";

const { DB_VERSION, STORE_NAME, DB_PREFIX, DB_NAME } = config;

export default class BlogPostRepositoryIndexDB extends RepositoryContract {
  constructor(dbName = DB_NAME) {
    super(dbName);
    this.dbName = `${DB_PREFIX}${dbName}`;
    this.dbPromise = this.#initDB();
  }

  async #initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error("[IndexedDB] DB open error:", request.error);
        reject(request.error);
      };
    });
  }

  async #performStoreAction(mode, fn) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      const result = fn(store);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => {
        console.error("[IndexedDB] Transaction error:", tx.error);
        reject(tx.error);
      };
      tx.onabort = () => {
        console.error("[IndexedDB] Transaction aborted:", tx.error);
        reject(tx.error);
      };
    });
  }

  async addPost(post) {
    return this.#performStoreAction("readwrite", (store) => {
      try {
        return store.put(post);
      } catch (err) {
        console.error("[IndexedDB] addPost error:", err);
        throw err;
      }
    });
  }

  async getPostById(id) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result ? new BlogPost(request.result) : null;
        resolve(result);
      };
      request.onerror = () => {
        console.error("[IndexedDB] getPostById error:", request.error);
        reject(request.error);
      };
    });
  }

  async updatePost(post) {
    return this.#performStoreAction("readwrite", (store) => {
      try {
        return store.put(post);
      } catch (err) {
        console.error("[IndexedDB] updatePost error:", err);
        throw err;
      }
    });
  }

  async deletePost(id) {
    return this.#performStoreAction("readwrite", (store) => {
      try {
        return store.delete(id);
      } catch (err) {
        console.error("[IndexedDB] deletePost error:", err);
        throw err;
      }
    });
  }

  async getAllPosts() {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        // Map plain objects to BlogPost instances
        const posts = (request.result || []).map((obj) => new BlogPost(obj));
        resolve(posts);
      };
      request.onerror = () => {
        console.error("[IndexedDB] getAllPosts error:", request.error);
        reject(request.error);
      };
    });
  }

  // --- Test Utilities ---

  async clearAll() {
    return this.#performStoreAction("readwrite", (store) => {
      try {
        return store.clear();
      } catch (err) {
        console.error("[IndexedDB] clearAll error:", err);
        throw err;
      }
    });
  }

  async deleteDatabase() {
    const db = await this.dbPromise;
    db.close();
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(this.dbName);
      req.onsuccess = () => resolve();
      req.onerror = () => {
        console.error("[IndexedDB] deleteDatabase error:", req.error);
        reject(req.error);
      };
      req.onblocked = () => {
        console.error("[IndexedDB] deleteDatabase blocked");
        reject(new Error("Delete blocked"));
      };
    });
  }
}
