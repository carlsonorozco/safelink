import { MetricRepository } from '../Repositories'

export class Metric {
  public static async getSummary(
    request: Request,
    event: FetchEvent,
  ): Promise<Response> {
    const cache = caches.default
    let response = await cache.match(event.request)
    if (!response) {
      const metric = (await MetricRepository.grabMeasures()) || {
        count_links_checked: 0,
        count_links_safe: 0,
        count_links_malware: 0,
        count_links_adult_content: 0,
        most_recently_checked: [],
      }
      response = new Response(
        JSON.stringify({
          data: {
            count_links_checked: metric.count_links_checked,
            count_links_safe: metric.count_links_safe,
            count_links_malware: metric.count_links_malware,
            count_links_adult_content: metric.count_links_adult_content,
            most_recently_checked: metric.most_recently_checked,
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=120',
          },
        },
      )
      event.waitUntil(cache.put(event.request, response.clone()))
    }
    return response
  }

  public static async updateMeasures(): Promise<void> {
    await MetricRepository.updateMeasures()
  }
}
