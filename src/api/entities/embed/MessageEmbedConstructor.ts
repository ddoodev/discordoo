import { MessageEmbedData } from '@src/api/entities/embed/interfaces/MessageEmbedData'
import { is } from 'typescript-is'
import { attach, ValidationError, WebSocketUtils } from '@src/utils'
import { MessageEmbedTypes } from '@src/constants'
import { MessageEmbedFieldData } from '@src/api/entities/embed/interfaces/MessageEmbedFieldData'
import { MessageEmbedAuthorData } from '@src/api/entities/embed/interfaces/MessageEmbedAuthorData'
import {
  MessageEmbedImageData,
  MessageEmbedThumbnailData,
  MessageEmbedVideoData
} from '@src/api/entities/embed/interfaces/MessageEmbedAttachmentData'
import { MessageEmbedFooterData } from '@src/api/entities/embed/interfaces/MessageEmbedFooterData'
import { resolveColor } from '@src/utils/resolve'
import { ColorResolvable } from '@src/api/entities/interfaces/ColorResolvable'
import { RawMessageEmbedData } from '@src/api/entities/embed/interfaces/RawMessageEmbedData'
import { MessageEmbed } from '@src/api'

export class MessageEmbedConstructor {
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

  constructor(data?: MessageEmbedData | RawMessageEmbedData | MessageEmbed) {
    attach(this, data, {
      props: [
        'title',
        'description',
        'url',
        'author',
        'thumbnail',
        'image',
        'video',
        'footer',
      ]
    })

    if (data && WebSocketUtils.exists<number | Date>(data.timestamp)) {
      this.timestamp = new Date(data.timestamp).getTime()
    }

    if (data && WebSocketUtils.exists<ColorResolvable>(data.color)) {
      this.color = resolveColor(data.color)
    }

    this.fields = data?.fields ? this._fixFields(data.fields) : []
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

  addField(field: MessageEmbedFieldData): this {
    if (!is<MessageEmbedFieldData>(field)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect field data')
    }

    this.fields.push({ name: field.name, value: field.value, inline: field.inline ?? false })
    return this
  }

  addFields(...fields: Array<MessageEmbedFieldData | MessageEmbedFieldData[]>): this {
    if (!is<Array<MessageEmbedFieldData | MessageEmbedFieldData[]>>(fields)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect fields data')
    }

    this.fields.push(...this._fixFields(fields))
    return this
  }

  spliceFields(start: number, deleteCount: number, ...fields: Array<MessageEmbedFieldData | MessageEmbedFieldData[]>): this {
    if (!is<number>(start)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect splice start: must be number')
    }

    if (!is<number>(deleteCount)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect splice delete count: must be number')
    }

    if (!is<Array<MessageEmbedFieldData | MessageEmbedFieldData[]>>(fields)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect splice replace fields')
    }

    this.fields.splice(start, deleteCount, ...this._fixFields(fields))
    return this
  }

  setFields(...fields: Array<MessageEmbedFieldData | MessageEmbedFieldData[]>) {
    this.spliceFields(0, this.fields.length, ...fields)
    return this
  }

  setAuthor(author: MessageEmbedAuthorData | null): this {
    if (!is<MessageEmbedAuthorData | null>(author)) {
      throw new ValidationError(
        'MessageEmbedConstructor', 'Incorrect message embed author data: must be MessageEmbedAuthorData or null'
      )
    }

    this.author = author ?? undefined
    return this
  }

  setDescription(description: string | null): this {
    if (!is<string | null>(description)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect description: must be string or null')
    }

    this.description = description ?? undefined
    return this
  }

  setColor(color: ColorResolvable | null): this {
    if (!is<ColorResolvable | null>(color)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect color: must be ColorResolvable or null')
    }

    this.color = is<null>(color) ? undefined : resolveColor(color)
    return this
  }

  setFooter(text: string | null, icon?: string | null): this {
    if (!is<string | null>(text)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect footer text: must be string or null')
    }

    if (icon !== undefined && !is<string | null>(icon)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect icon: must be string or null')
    }

    this.footer = is<null>(text) ? undefined : { text, iconUrl: is<null>(icon) ? undefined : icon }
    return this
  }

  setFooterText(text: string | null): this {
    if (!is<string | null>(text)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect footer text: must be string or null')
    }

    this.footer = is<null>(text) ? undefined : { text, iconUrl: this.footer?.iconUrl }
    return this
  }

  setFooterImage(url: string | null): this {
    const isNull = is<null>(url)

    if (!is<string>(url) && !isNull) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect footer image: must be string or null')
    }

    if (!this.footer?.text && isNull) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect footer: cannot update footer image without footer text')
    }

    this.footer = (isNull && !this.footer?.text) ? undefined : { text: this.footer!.text, iconUrl: isNull ? undefined : url }
    return this
  }

  setImage(url: string | null): this {
    if (!is<string | null>(url)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect image url: must be string or null')
    }

    this.image = is<null>(url) ? undefined : { url }
    return this
  }

  setThumbnail(url: string | null): this {
    if (!is<string | null>(url)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect thumbnail url: must be string or null')
    }

    this.thumbnail = is<null>(url) ? undefined : { url }
    return this
  }

  /*
  Discord says: For the embed object, you can set every field except type
  (it will be rich regardless of if you try to set it), provider, video, and any height, width, or proxy_url values for images.

  setVideo(url: string | null): this {
    if (!is<string | null>(url)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect video url: must be string or null')
    }

    this.video = is<null>(url) ? undefined : { url }
    return this
  }

  setProvider(provider: MessageEmbedProviderData | null): this {
    if (!is<MessageEmbedProviderData | null>(provider)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect provider: must be MessageEmbedProviderData or null')
    }

    this.provider = provider ?? undefined
    return this
  }
  */

  setTimestamp(timestamp: number | null = Date.now()): this {
    if (!is<number | null>(timestamp)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect timestamp: must be number or null')
    }

    this.timestamp = timestamp ?? undefined
    return this
  }

  setTitle(title: string | null): this {
    if (!is<string | null>(title)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect title: must be string or null')
    }

    this.title = title ?? undefined
    return this
  }

  setUrl(url: string | null): this {
    if (!is<string | null>(url)) {
      throw new ValidationError('MessageEmbedConstructor', 'Incorrect url: must be string or null')
    }

    this.url = url ?? undefined
    return this
  }

  private _fixFields(...fields: any[]): any[] {
    return fields.flat(2)
      .map(field =>
        this._fixFields(field.name, field.value, is<boolean>(field.inline) ? field.inline : false)
      )
  }

  toJson(): RawMessageEmbedData {
    const { title, description, url, color, timestamp, author, footer, image, thumbnail } = this

    const result = {
      type: MessageEmbedTypes.Rich, title, description, url, color,
      timestamp: timestamp ? new Date(timestamp).toISOString() : undefined,
      author: author ? { name: author.name, url: author.url, icon_url: author.iconUrl } : undefined,
      footer: footer ? { text: footer.text, icon_url: footer.iconUrl } : undefined,
      image: image ? { url: image.url } : undefined,
      thumbnail: thumbnail ? { url: thumbnail.url } : undefined,
      fields: this.fields.map(field => ({ name: field.name, value: field.value, inline: field.inline }))
    }

    return JSON.parse(JSON.stringify(result))
  }

  get toJSON() {
    return this.toJson.bind(this)
  }

}