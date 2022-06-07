import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { WritableChannel } from '@src/api/entities/channel/interfaces/WritableChannel'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { MessageCreateOptions } from '@src/api/entities/message/interfaces/MessageCreateOptions'
import { Json, Message, ToJsonProperties } from '@src/api'
import { DirectMessagesChannelMessagesManager } from '@src/api/managers/messages/DirectMessagesChannelMessagesManager'
import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { attach } from '@src/utils'
import { ChannelTypes } from '@src/constants'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class DirectMessagesChannel extends AbstractChannel implements WritableChannel {
  public declare messages: DirectMessagesChannelMessagesManager
  public declare type: ChannelTypes.DM
  public lastMessageId?: string
  public lastPinTimestamp?: number

  async init(data: AbstractChannelData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    attach(this, data, {
      props: [
        [ 'lastMessageId', 'last_message_id' ],
        [ 'lastPinTimestamp', 'last_pin_timestamp' ]
      ],
      disabled: options?.ignore,
      enabled: [ 'lastMessageId' ]
    })

    if (this.lastPinTimestamp) { // discord sends timestamp in string
      this.lastPinTimestamp = new Date(this.lastPinTimestamp).getTime()

      if (this.messages) {
        this.messages.pinned.lastPinTimestamp = this.lastPinTimestamp
      }
    }

    if (!this.messages) {
      this.messages = new DirectMessagesChannelMessagesManager(this.client, {
        channel: this.id,
        lastMessageId: this.lastMessageId,
        lastPinTimestamp: this.lastPinTimestamp,
      })
    }

    if (this.lastMessageId) {
      this.messages.lastMessageId = this.lastMessageId
    }

    return this
  }

  send(content: MessageContent, options?: MessageCreateOptions): Promise<Message | undefined> {
    return this.client.messages.create(this.id, content, options)
  }

  set lastMsgId(id: string) {
    this.lastMessageId = id
    this.messages.lastMessageId = id
  }

  get lastPinDate(): Date | undefined {
    return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : undefined
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      lastMessageId: true,
      lastPinTimestamp: true,
    }, obj)
  }

}
