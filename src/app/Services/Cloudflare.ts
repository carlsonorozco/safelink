export class Cloudflare {
  public static async dnsOverHttps(
    domain: string,
    checkType: string,
  ): Promise<any> {
    let dohLink
    if (checkType === 'malware') {
      dohLink = `https://security.cloudflare-dns.com/dns-query?name=${domain}`
    } else if (checkType === 'adult_content') {
      dohLink = `https://family.cloudflare-dns.com/dns-query?name=${domain}`
    } else {
      dohLink = `https://cloudflare-dns.com/dns-query?name=${domain}`
    }
    const request = new Request(dohLink, {
      headers: {
        Accept: 'application/dns-json',
      },
    })
    const cache = caches.default
    let response = await cache.match(request)
    if (!response) {
      response = await fetch(request)
      response = new Response(response.body, response)
      response.headers.append('Cache-Control', 's-maxage=300') // 5 minutes
      await cache.put(request, response.clone())
    }

    return response.json()
  }

  public static isDomainSafe(
    answer: Array<{
      name: string
      type: number
      TTL: number
      data: string
    }>,
  ): boolean {
    return !answer.some((record) => {
      return record.data === '0.0.0.0'
    })
  }
}
