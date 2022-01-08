import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames } from '@src/constants'
import { RawMessageData } from '@src/api/entities/message/interfaces/RawMessageData'
import { MessageCreateEventContext } from '@src/events/ctx/MessageCreateEventContext'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { AnyWritableChannel } from '@src/api/entities/channel/interfaces/AnyWritableChannel'

export class MessageCreateEvent extends AbstractEvent {
  public name = EventNames.MESSAGE_CREATE

  async execute(shardId: number, data: RawMessageData) {
    const Message = EntitiesUtil.get('Message')

    const message = await new Message(this.client).init(data)
    await this.client.messages.cache.set(message.id, message, { storage: message.channelId })

    let author = await this.client.users.cache.get(data.author.id)

    if (author) {
      author = await author.init(data.author)
    } else {
      const User = EntitiesUtil.get('User')
      author = await new User(this.client).init(data.author)
    }

    await this.client.users.cache.set(author.id, author)

    const channel = await this.client.channels.cache.get<AnyWritableChannel>(message.channelId, {
      storage: message.guildId ?? message.authorId
    })

    if (channel) {
      channel.lastMsgId = message.id
      await this.client.channels.cache.set(message.channelId, channel, {
        storage: message.guildId ?? message.authorId
      })
    }

    const context: MessageCreateEventContext = {
      message,
      author,
      channel,
      channelId: message.channelId,
      authorId: message.authorId,
      messageId: message.id,
    }

    this.client.emit(EventNames.MESSAGE_CREATE, context)
  }
}
