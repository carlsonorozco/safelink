export class LinkRepository {
  public static async store(link: string, type: string): Promise<void> {
    const now = new Date().toISOString()
    const MAX_TIMESTAMP = 2147483647000
    const linkId = (MAX_TIMESTAMP - Date.parse(now))
      .toString()
      .padStart(13, '0')
    const key = `${linkId}:${link}`
    await SL_LINKS.put(
      key,
      JSON.stringify({
        link_id: linkId,
        link,
        type,
        created_at: new Date().toISOString(),
      }),
      {
        metadata: {
          link_id: linkId,
          link,
          type,
          created_at: new Date().toISOString(),
        },
      },
    )
  }
}
