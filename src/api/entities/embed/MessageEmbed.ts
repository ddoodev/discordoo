import {
  MessageEmbedAuthorData,
  MessageEmbedData,
  MessageEmbedFieldData,
  MessageEmbedFooterData,
  MessageEmbedImageData,
  MessageEmbedProviderData,
  MessageEmbedThumbnailData,
  MessageEmbedVideoData,
  RawMessageEmbedData
} from '../../../../src/api'
import { attach } from '../../../../src/utils'
import { is } from 'typescript-is'
import { MessageEmbedTypes } from '../../../../src/constants'
import { EntityInitOptions } from '../../../../src/api/entities/EntityInitOptions'
import { AbstractEntity } from '../../../../src/api/entities/AbstractEntity'

export class MessageEmbed extends AbstractEntity implements MessageEmbedData {
  public type = MessageEmbedTypes.Rich
  public title?: string
  public description?: string
  public url?: string
  public timestamp?: number
  public color?: number
  public fields: MessageEmbedFieldData[] = []
  public author?: MessageEmbedAuthorData
  public thumbnail?: MessageEmbedThumbnailData
  public image?: MessageEmbedImageData
  public video?: MessageEmbedVideoData
  public footer?: MessageEmbedFooterData
  public provider?: MessageEmbedProviderData

  async init(data: RawMessageEmbedData | MessageEmbed, options?: EntityInitOptions): Promise<this> {
    const info = data instanceof MessageEmbed ? data : MessageEmbed._resolveJson(data)
    attach(this, info, {
      props: [
        'title',
        'description',
        'url',
        'author',
        'thumbnail',
        'image',
        'video',
        'footer',
        'provider',
        'color',
        'fields',
        'timestamp',
        [ 'type', 'type', MessageEmbedTypes.Rich ],
      ],
      disabled: options?.ignore,
    })

    this.fields = info.fields ? this._fixFields(this.fields) : []

    return this
  }

  get createdDate(): Date | undefined {
    return this.timestamp ? new Date(this.timestamp) : undefined
  }

  get textLength(): number {
    return (
      (this.title?.length ?? 0) +
      (this.description?.length ?? 0) +
      (this.fields.length >= 1
        ? this.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
        : 0) +
      (this.footer?.text.length ?? 0) +
      (this.author?.name.length ?? 0)
    )
  }

  private _fixFields(...fields: any[]): any[] {
    return fields.flat(2)
      .map(field =>
        this._fixFields(field.name, field.value, is<boolean>(field.inline) ? field.inline : false)
      )
  }

  private static _resolveJson(data: RawMessageEmbedData): MessageEmbedData {
    const { title, description, url, color, timestamp, author, footer, image, video, thumbnail: thumb, provider } = data

    return {
      type: MessageEmbedTypes.Rich, title, description, url, color, provider,
      timestamp: timestamp ? new Date(timestamp).getTime() : undefined,
      author: author ? { name: author.name, url: author.url, iconUrl: author.icon_url } : undefined,
      footer: footer ? { text: footer.text, iconUrl: footer.icon_url } : undefined,
      image: image ? { url: image.url, proxyUrl: image.proxy_url, width: image.width, height: image.height } : undefined,
      thumbnail: thumb ? { url: thumb.url, proxyUrl: thumb.proxy_url, width: thumb.width, height: thumb.height } : undefined,
      video: video ? { url: video.url, proxyUrl: video.proxy_url, width: video.width, height: video.height } : undefined,
    }
  }
}
