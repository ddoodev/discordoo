import { AbstractEvent, MessageDeleteBulkEventContext } from '@src/events'
import { EventNames } from '@src/constants'
import { RawMessageDeleteBulkEventData } from '@src/events/message/RawMessageDeleteBulkEventData'

export class MessageDeleteBulkEvent extends AbstractEvent<MessageDeleteBulkEventContext> {
  public name = EventNames.MESSAGE_DELETE_BULK
  async execute(shardId: number, data: RawMessageDeleteBulkEventData) {
    const storedMessagesMap = await this.app.messages.cache.filter((message) => data.ids.includes(message.id))

    if (storedMessagesMap.length)
      await this.app.messages.cache.delete(storedMessagesMap.map(([ messageId ]) => messageId))

    const context: MessageDeleteBulkEventContext = {
      shardId,
      messageIds: data.ids,
      messages: storedMessagesMap.map(([ ,message ]) => message),
      channelId: data.channel_id,
      guildId: data.guild_id
    }

    this.app.emit(EventNames.MESSAGE_DELETE_BULK, context)
    return context
  }
}