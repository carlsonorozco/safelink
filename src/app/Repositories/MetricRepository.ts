interface IMetric {
  latest_link_id: string
  count_links_checked: number
  count_links_safe: number
  count_links_malware: number
  count_links_adult_content: number
  most_recently_checked: Array<any>
}

export class MetricRepository {
  public static async grabMeasures(): Promise<IMetric | null> {
    return SL_METRICS.get('latest_metrics', 'json')
  }

  public static async updateMeasures(): Promise<void> {
    const links = await SL_LINKS.list()
    const metric: IMetric = (await SL_METRICS.get(
      'latest_metrics',
      'json',
    )) || {
      latest_link_id: '',
      count_links_checked: 0,
      count_links_safe: 0,
      count_links_malware: 0,
      count_links_adult_content: 0,
      most_recently_checked: [],
    }
    metric.most_recently_checked = links.keys.slice(0, 8).map((key) => {
      const metadata: any = key.metadata
      return {
        link: metadata.link,
        type: metadata.type,
      }
    })

    for (const index in links.keys) {
      if (metric.latest_link_id === links.keys[index].name) {
        if (parseInt(index) !== 0) {
          metric.latest_link_id = links.keys[0].name
          await SL_METRICS.put('latest_metrics', JSON.stringify(metric))
        }
        break
      }

      const metadata: any = links.keys[index].metadata

      const type: string = metadata.type
      switch (type) {
        case 'safe':
          metric.count_links_safe++
          break
        case 'malware':
          metric.count_links_malware++
          break
        case 'adult_content':
          metric.count_links_adult_content++
          break
      }
      metric.count_links_checked++

      if (parseInt(index) === links.keys.length - 1) {
        metric.latest_link_id = links.keys[0].name
        await SL_METRICS.put('latest_metrics', JSON.stringify(metric))
      }
    }
  }
}
