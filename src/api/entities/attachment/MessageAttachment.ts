import { RawMessageAttachmentData } from '@src/api/entities/attachment/interfaces/RawMessageAttachmentData'
import { attach } from '@src/utils'
import { SPOILER_PREFIX } from '@src/constants'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'

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

  async init(data: RawMessageAttachmentData): Promise<this> {
    attach(this, data, {
      props: [
        [ 'contentType', 'content_type' ],
        'ephemeral',
        [ 'name', 'filename' ],
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

}
