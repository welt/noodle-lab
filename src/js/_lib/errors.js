export class ApiError extends Error {
  constructor(message = "API error", details = {}) {
    super(message);
    this.name = "ApiError";
    this.details = details;
  }
}
