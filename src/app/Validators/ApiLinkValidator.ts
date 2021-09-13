import { Cloudflare } from '../Services'
import isIp from 'is-ip'

export class ApiLinkValidator {
  public static async validateLink(content: any): Promise<any> {
    const link = content.link
    content.errors = {}
    if (link.length === 0) {
      content.errors.link = 'Link field is required.'
    }

    if (link.length > 1000) {
      content.errors.link = 'Link is too long.'
    }

    try {
      const url = new URL(link)
      if (isIp(url.hostname)) {
        content.errors.link = 'Link IP address is not supported.'
      }
      if (url.hostname === '') {
        content.errors.link = 'Link is invalid2.'
      }
      const dnsMalware = await Cloudflare.dnsOverHttps(url.hostname, 'malware')
      const dnsAdultContent = await Cloudflare.dnsOverHttps(
        url.hostname,
        'adult_content',
      )
      const dnsSafe = await Cloudflare.dnsOverHttps(url.hostname, 'safe')
      if (dnsMalware.Status !== 0 || dnsAdultContent.Status !== 0) {
        content.errors.link = 'Link is unresolved.'
      } else if (
        dnsMalware.Status === 0 &&
        dnsMalware?.Answer &&
        !Cloudflare.isDomainSafe(dnsMalware.Answer)
      ) {
        content.dnsMalware = dnsMalware
        content.errors.link =
          'The link is not safe for browsing, it may contain malware content that is dangerous to your device.'
      } else if (
        dnsAdultContent.Status === 0 &&
        dnsAdultContent?.Answer &&
        !Cloudflare.isDomainSafe(dnsAdultContent.Answer)
      ) {
        content.dnsAdultContent = dnsAdultContent
        content.errors.link =
          'The link is not safe for browsing, it may contain adult content that could harm you.'
      }
      content.dnsSafe = dnsSafe
    } catch {
      content.errors.link = 'Link is invalid.'
    }
    return content
  }
}
