export class F1ReporterError extends Error {
  constructor(message) {
    super(message);
    this.name = "F1ReporterError";
  }
}
