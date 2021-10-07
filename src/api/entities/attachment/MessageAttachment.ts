import { RawMessageAttachmentData } from '@src/api/entities/attachment/interfaces/RawMessageAttachmentData'
import { BufferResolvable } from '@src/api/entities/interfaces/BufferResolvable'
import { RawAttachment } from '@discordoo/providers'
import { DataResolver } from '@src/utils/DataResolver'
import { MessageAttachmentOptions } from '@src/api/entities/attachment/interfaces/MessageAttachmentOptions'
import { MessageAttachmentData } from '@src/api/entities/attachment/interfaces/MessageAttachmentData'
import { attach } from '@src/utils/attach'
import { SPOILER_PREFIX } from '@src/constants'

export class MessageAttachment {
  public file: BufferResolvable
  public name: string
  public ephemeral: boolean
  public id?: string
  public contentType?: string
  public size?: number
  public url?: string
  public proxyUrl?: string
  public height?: number
  public width?: number

  private _options?: MessageAttachmentOptions

  constructor(data: MessageAttachmentData | RawMessageAttachmentData, options?: MessageAttachmentOptions) {
    this._options = options

    if ('file' in data) {
      this.file = data.file
      this.name = (data.spoiler ? SPOILER_PREFIX : '') + (data.name ?? 'attachment')
      this.ephemeral = data.ephemeral ?? false
    } else {
      this.file = data.url
      this.name = data.filename
      this.ephemeral = data.ephemeral ?? false

      this.contentType = data.content_type
      this.proxyUrl = data.proxy_url

      attach(this, data, [
        'id',
        'size',
        'url',
        'height',
        'width',
      ])
    }
  }

  get spoiler(): boolean {
    return this.name.startsWith(SPOILER_PREFIX)
  }

  setSpoiler(condition: boolean): this {
    switch (condition) {
      case true: {
        if (!this.name.startsWith(SPOILER_PREFIX)) this.name = SPOILER_PREFIX + this.name

        return this
      }
      case false: {
        if (this.name.startsWith(SPOILER_PREFIX)) {
          while (this.spoiler) {
            this.name = this.name.slice(SPOILER_PREFIX.length)
          }
        }

        return this
      }
    }
  }

  setName(name: string): this {
    this.name = this.spoiler ? SPOILER_PREFIX + name : name

    return this
  }

  setFile(file: BufferResolvable) {
    this.file = file

    return this
  }

  async toRaw(): Promise<RawAttachment> {
    const data = await DataResolver.resolveBuffer(this.file, {
      fetch: this.id ? true : this._options?.fetch, // fetch file from url if it is discord attachment
      fetchOptions: this._options?.fetchOptions
    })

    return {
      data,
      name: this.name,
      ephemeral: this.ephemeral
    }
  }

}
