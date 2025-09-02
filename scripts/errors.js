export class GithubFetchError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = "GithubFetchError";
    this.status = status;
    this.url = url;
  }
}
