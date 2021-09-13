export class TokenMismatchError extends Error {
  public readonly status: number = 419

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.stack = new Error(message).stack
  }
}
