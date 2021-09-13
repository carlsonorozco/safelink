import { LinkRepository } from '../Repositories'
import { ApiLinkValidator } from '../Validators'
import { ValidationError } from '../Exceptions'

export class Link {
  public static async check(
    request: Request,
    event: FetchEvent,
  ): Promise<Response> {
    const content = await ApiLinkValidator.validateLink(request.content)
    if (content.dnsMalware) {
      event.waitUntil(LinkRepository.store(content.link, 'malware'))
    } else if (content.dnsAdultContent) {
      event.waitUntil(LinkRepository.store(content.link, 'adult_content'))
    }

    if (content.errors && Object.keys(content.errors).length > 0) {
      throw new ValidationError('Unprocessable Entity')
    }
    delete content.errors
    event.waitUntil(LinkRepository.store(content.link, 'safe'))
    return new Response(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Link is safe.',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
