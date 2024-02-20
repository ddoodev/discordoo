import { AbstractEvent } from '@src/events'
import { EventNames } from '@src/constants'
import { RawMessageDeleteEventData } from './RawMessageDeleteEventData'
import { MessageDeleteEventContext } from '@src/events/message/ctx/MessageDeleteEventContext'

export class MessageDeleteEvent extends AbstractEvent<MessageDeleteEventContext> {
  public name = EventNames.MESSAGE_DELETE

  async execute(shardId: number, data: RawMessageDeleteEventData) {
    const message = await this.app.messages.cache.get(data.id, { storage: data.channel_id })

    if (message) {
      await this.app.messages.cache.delete(data.id)
    }

    const context: MessageDeleteEventContext = {
      shardId,
      message,
      messageId: data.id,
      channelId: data.channel_id,
      guildId: data.guild_id
    }

    this.app.emit(EventNames.MESSAGE_DELETE, context)
    return context
  }
}