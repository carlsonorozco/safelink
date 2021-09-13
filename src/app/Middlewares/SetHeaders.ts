export const setHeaders = (event: FetchEvent, response: Response): Response => {
  response = new Response(response.body, response)
  response.headers.set(
    'Cache-Control',
    'no-cache,no-store,max-age=0,must-revalidate',
  )
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '-1')
  // Set by cloudflare
  // response.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains; preload);
  response.headers.set('X-XSS-Protection', '1; mode=block;')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set(
    'Content-Security-Policy',
    `default-src * data: blob: 'self'; script-src https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js  https://static.cloudflareinsights.com/beacon.min.js 'unsafe-inline' 'unsafe-eval' blob: data: 'self'; style-src data: blob: 'unsafe-inline' *; connect-src *.safelink.one safelink.one cloudflareinsights.com api.fontawesome.com ; block-all-mixed-content; upgrade-insecure-requests;`,
  )
  response.headers.set('Referrer-Policy', 'origin')
  // // Set by cloudflare
  // response.headers.set('X-Content-Type-Options', 'nosniff')
  return response
}
