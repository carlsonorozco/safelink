export const withContent = async (request: Request): Promise<void> => {
  const contentType: string = request.headers.get('Content-Type') || ''
  request.content = undefined
  try {
    if (contentType) {
      if (contentType.includes('application/json')) {
        request.content = await request.json()
      }
    }
  } catch {
    // silently fail on error
  }
}
