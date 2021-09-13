export class UnauthorizedError extends Error {
  public readonly status: number = 401

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.stack = new Error(message).stack
  }
}
