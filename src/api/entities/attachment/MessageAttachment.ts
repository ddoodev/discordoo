import { RawMessageAttachmentData } from '@src/api/entities/attachment/interfaces/RawMessageAttachmentData'
import { BufferResolvable } from '@src/utils/interfaces/BufferResolvable'
import { RawAttachment } from '@discordoo/providers'
import { DataResolver } from '@src/utils/DataResolver'
import { MessageAttachmentOptions } from '@src/api/entities/attachment/interfaces/MessageAttachmentOptions'
import { MessageAttachmentData } from '@src/api/entities/attachment/interfaces/MessageAttachmentData'
import { attach, randomString } from '@src/utils'
import { SPOILER_PREFIX } from '@src/constants'

export class MessageAttachment {
  public declare file: BufferResolvable
  public declare name: string
  public declare ephemeral: boolean
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

    attach(this, data, {
      props: [
        'id',
        'size',
        [ 'ephemeral', '', false ],
        [ 'file', 'url' ],
        'url',
        [ 'contentType', 'content_type' ],
        [ 'proxyUrl', 'proxy_url' ],
        'height',
        'width',
        [ 'name', 'filename', `${randomString()}.png` ]
      ]
    })

    if ('spoiler' in data) {
      this.setSpoiler(!!data.spoiler)
    }

  }

  get spoiler(): boolean {
    return this.name.startsWith(SPOILER_PREFIX)
  }

  setSpoiler(condition: boolean): this {
    switch (condition) {
      case true: {
        if (!this.name.startsWith(SPOILER_PREFIX)) this.name = SPOILER_PREFIX + this.name
      } break
      case false: {
        if (this.name.startsWith(SPOILER_PREFIX)) {
          while (this.spoiler) {
            this.name = this.name.slice(SPOILER_PREFIX.length)
          }
        }
      } break
    }

    return this
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
      name: this.name
    }
  }

}
