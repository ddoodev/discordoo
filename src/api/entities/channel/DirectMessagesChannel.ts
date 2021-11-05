import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { WritableChannel } from '@src/api/entities/channel/interfaces/WritableChannel'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { MessageCreateOptions } from '@src/api/entities/message/interfaces/MessageCreateOptions'
import { Json, Message, ToJsonProperties } from '@src/api'
import { DirectMessagesChannelMessagesManager } from '@src/api/managers/messages/DirectMessagesChannelMessagesManager'
import { AbstractChannelData } from '@src/api/entities/channel/interfaces/AbstractChannelData'
import { attach } from '@src/utils'
import { ChannelTypes } from '@src/constants'

export class DirectMessagesChannel extends AbstractChannel implements WritableChannel {
  public messages!: DirectMessagesChannelMessagesManager
  public type!: ChannelTypes.DM
  public lastMessageId?: string
  public lastPinTimestamp?: number

  async init(data: AbstractChannelData): Promise<this> {
    await super.init(data)

    attach(this, data, [
      [ 'lastMessageId', 'last_message_id' ],
      [ 'lastPinTimestamp', 'last_pin_timestamp' ]
    ])

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

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      lastMessageId: true,
      lastPinTimestamp: true,
    }, obj)
  }

}
