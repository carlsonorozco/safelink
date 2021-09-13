export class NotFoundError extends Error {
  public readonly status: number = 404

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.stack = new Error(message).stack
  }
}
