import { UnauthorizedError } from '../Exceptions'

export const verifyReferer = (request: Request): void => {
  const referer: string = request.headers.get('Referer') || ''
  if (!referer.startsWith(BASE_URL)) {
    throw new UnauthorizedError('Unauthorized access.')
  }
}
