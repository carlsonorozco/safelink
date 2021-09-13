import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

export class DefaultController {
  public static async index(
    request: Request,
    event: FetchEvent,
  ): Promise<Response> {
    return await getAssetFromKV(event)
  }

  public static async about(
    request: Request,
    event: FetchEvent,
  ): Promise<Response> {
    const response: Response = await getAssetFromKV(event, {
      mapRequestToAsset: (request) =>
        new Request(`${BASE_URL}/about.html`, request),
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

  public static async viewManifestWebmanifest(
    request: Request,
    event: FetchEvent,
  ): Promise<Response> {
    return getAssetFromKV(event, {
      mapRequestToAsset: (request: Request) => {
        return mapRequestToAsset(
          new Request(`${BASE_URL}/manifest.webmanifest`, request),
        )
      },
      cacheControl: {
        browserTTL: undefined, // do not set cache control ttl on responses
        edgeTTL: 2 * 60 * 60 * 24, // 2 days
        bypassCache: false, // do not bypass Cloudflare's cache
      },
    })
  }

  public static async viewBrowserConfigXml(
    request: Request,
    event: FetchEvent,
  ): Promise<Response> {
    return getAssetFromKV(event, {
      mapRequestToAsset: (request: Request) => {
        return mapRequestToAsset(
          new Request(`${BASE_URL}/browserconfig.xml`, request),
        )
      },
      cacheControl: {
        browserTTL: undefined, // do not set cache control ttl on responses
        edgeTTL: 2 * 60 * 60 * 24, // 2 days
        bypassCache: false, // do not bypass Cloudflare's cache
      },
    })
  }
}
