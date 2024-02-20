import { AbstractEvent } from '@src/events'
import { MessageUpdateEventContext } from '@src/events/message/ctx/MessageUpdateEventContext'
import { EventNames } from '@src/constants'
import { EntitiesUtil, RawMessageData } from '@src/api'

export class MessageUpdateEvent extends AbstractEvent<MessageUpdateEventContext> {
  public name = EventNames.MESSAGE_UPDATE

  async execute(shardId: number, data: RawMessageData) {
    const Message = EntitiesUtil.get('Message')

    const stored = await this.app.messages.cache.get(data.id, { storage: data.channel_id })
    const updated = stored ? await (await stored._clone()).init(data) : await new Message(this.app).init(data)

    await this.app.messages.cache.set(updated.id, updated, { storage: data.channel_id })

    const context: MessageUpdateEventContext = {
      shardId,
      stored,
      updated,
      messageId: data.id,
      channelId: data.channel_id
    }

    this.app.emit(EventNames.MESSAGE_UPDATE, context)
    return context
  }
}