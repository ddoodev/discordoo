import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { Client } from '@src/core'
import { MessageAttachmentData } from '@src/api/entities/attachment/interfaces/MessageAttachmentData'
import { BufferResolvable } from '@src/api/entities/interfaces/BufferResolvable'
import { RawAttachment } from '@discordoo/providers'
import { DataResolver } from '@src/utils/DataResolver'

export class MessageAttachment extends AbstractEntity implements MessageAttachmentData {
  public attachment!: BufferResolvable
  public name?: string
  public id?: string
  public size?: number
  public url?: string
  public proxy_url?: string
  public height?: number
  public width?: number

  private _data!: RawAttachment['data']

  constructor(client: Client) { // TODO: ResolveBufferOptions aka MessageAttachmentOptions
    super(client)
  }

  toRaw(): RawAttachment {
    return {
      data: this._data,
      name: this.name ?? ''
    }
  }

  async init(data: MessageAttachmentData): Promise<this> {
    this.attachment = data.attachment

    this._data = await DataResolver.resolveBuffer(data.attachment)

    return this
  }

}
