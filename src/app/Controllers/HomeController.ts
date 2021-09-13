import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export class HomeController {
  public static async index(
    request: Request,
    event: FetchEvent,
  ): Promise<Response> {
    const response: Response = await getAssetFromKV(event, {
      mapRequestToAsset: (request) =>
        new Request(`${BASE_URL}/index.html`, request),
    })
    return new HTMLRewriter()
      .on('*', {
        element(element) {
          if (element.hasAttribute('href')) {
            const href = element.getAttribute('href') || 'http://localhost:9000'
            element.setAttribute(
              'href',
              href.replace('http://localhost:9000', BASE_URL),
            )
          } else if (element.hasAttribute('src')) {
            const src = element.getAttribute('src') || 'http://localhost:9000'
            element.setAttribute(
              'src',
              src.replace('http://localhost:9000', BASE_URL),
            )
          } else if (element.hasAttribute('action')) {
            const action =
              element.getAttribute('action') || 'http://localhost:9000'
            element.setAttribute(
              'action',
              action.replace('http://localhost:9000', BASE_URL),
            )
          }
        },
      })
      .on('head', {
        element(element) {
          element.prepend(
            `<meta property="og:image" content="${BASE_URL}/og.png">`,
            {
              html: true,
            },
          )
        },
      })
      .transform(response)
  }
}
