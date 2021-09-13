export {}

declare global {
  interface Request {
    content?: any
  }
  interface Error {
    status?: number
  }
  const BASE_URL: string
  const SL_LINKS: KVNamespace
  const SL_METRICS: KVNamespace
}
