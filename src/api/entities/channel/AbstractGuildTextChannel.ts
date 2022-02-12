import { AbstractGuildChannel } from '@src/api/entities/channel/AbstractGuildChannel'
import { WritableChannel } from '@src/api/entities/channel/interfaces/WritableChannel'
import { ChannelMessagesManager, Json, ToJsonProperties } from '@src/api'
import { AbstractGuildTextChannelData } from '@src/api/entities/channel/interfaces/AbstractGuildTextChannelData'
import { RawAbstractGuildTextChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildTextChannelData'
import { attach } from '@src/utils'

export abstract class AbstractGuildTextChannel extends AbstractGuildChannel implements WritableChannel {
  public messages!: ChannelMessagesManager
  public nsfw!: boolean
  public topic?: string
  public lastMessageId?: string
  public lastPinTimestamp?: number
  public defaultAutoArchiveDuration?: number

  async init(data: AbstractGuildTextChannelData | RawAbstractGuildTextChannelData): Promise<this> {
    await super.init(data)

    attach(this, data, {
      props: [
        'topic',
        [ 'lastMessageId', 'last_message_id' ],
        [ 'lastPinTimestamp', 'last_pin_timestamp' ],
        [ 'defaultAutoArchiveDuration', 'default_auto_archive_duration' ]
      ]
    })

    this.nsfw = !!data.nsfw

    if (typeof this.lastPinTimestamp === 'string'!) { // discord sends timestamp in string
      this.lastPinTimestamp = new Date(this.lastPinTimestamp!).getTime()

      if (this.messages) {
        this.messages.pinned.lastPinTimestamp = this.lastPinTimestamp
      }
    }

    if (!this.messages) {
      this.messages = new ChannelMessagesManager(this.client, {
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

  set lastMsgId(id: string) {
    this.lastMessageId = id
    this.messages.lastMessageId = id
  }

  get send() {
    return this.messages.create.bind(this.messages)
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      nsfw: true,
      topic: true,
      lastMessageId: true,
      lastPinTimestamp: true,
      defaultAutoArchiveDuration: true,
    }, obj)
  }

}
