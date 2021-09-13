export class ValidationError extends Error {
  public readonly status: number = 422

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.stack = new Error(message).stack
  }
}
