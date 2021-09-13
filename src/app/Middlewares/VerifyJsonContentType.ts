import { BadRequestError } from '../Exceptions'

export const verifyJsonContentType = (request: Request): void => {
  const contentType: string = request.headers.get('Content-Type') || ''
  if (!contentType.includes('application/json')) {
    throw new BadRequestError('Content-Type was not of JSON')
  }
}
