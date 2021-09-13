export class BadRequestError extends Error {
  public readonly status: number = 400

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.stack = new Error(message).stack
  }
}
