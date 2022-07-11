import { RawMessageAttachmentData } from '@src/api/entities/attachment/interfaces/RawMessageAttachmentData'
import { attach } from '@src/utils'
import { SPOILER_PREFIX } from '@src/constants'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { RawAttachment } from '@discordoo/providers'
import { DataResolver } from '@src/utils/DataResolver'
import { MessageAttachmentConstructorOptions } from '@src/api'

export class MessageAttachment extends AbstractEntity {
  declare contentType?: string
  declare ephemeral?: boolean
  declare filename: string
  declare height?: number
  declare id: string
  declare proxyUrl: string
  declare size: number
  declare url: string
  declare width?: number
  private _options?: MessageAttachmentConstructorOptions

  async init(data: RawMessageAttachmentData): Promise<this> {
    attach(this, data, {
      props: [
        [ 'contentType', 'content_type' ],
        'ephemeral',
        'filename',
        'height',
        'id',
        [ 'proxyUrl', 'proxy_url' ],
        'size',
        'url',
        'width',
      ]
    })

    return this
  }

  get spoiler(): boolean {
    return this.filename.startsWith(SPOILER_PREFIX)
  }

  async toRaw(): Promise<RawAttachment> {
    const data = await DataResolver.resolveBuffer(this.url, {
      fetch: true,
      fetchOptions: this._options?.fetchOptions
    })

    return {
      data,
      name: this.filename
    }
  }

}
