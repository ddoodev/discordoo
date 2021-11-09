import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames, Keyspaces } from '@src/constants'
import { RawMessageData } from '@src/api/entities/message/interfaces/RawMessageData'
import { channelEntityKey } from '@src/utils'
import { MessageCreateEventContext } from '@src/events/ctx/MessageCreateEventContext'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'

export class MessageCreateEvent extends AbstractEvent {
  public name = EventNames.MESSAGE_CREATE

  async execute(data: RawMessageData) {
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

    const channel = await this.client.internals.cache.get(
      Keyspaces.CHANNELS,
      message.guildId ?? message.authorId,
      channelEntityKey,
      message.channelId
    )

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
