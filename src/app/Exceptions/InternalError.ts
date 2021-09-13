export class InternalError extends Error {
  public readonly status: number = 500

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.stack = new Error(message).stack
  }
}
