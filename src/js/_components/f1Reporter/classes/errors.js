export class F1ReporterError extends Error {
  constructor(message) {
    super(message);
    this.name = "F1ReporterError";
  }
}

export class F1FetchError extends Error {
  constructor(message, { status = null, statusText = null, url = null, body = null, cause = null } = {}) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.body = body;
    if (cause) this.cause = cause;
  }
}
