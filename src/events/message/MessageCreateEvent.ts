import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames } from '@src/constants'
import { RawMessageData } from '@src/api/entities/message/interfaces/RawMessageData'
import { MessageCreateEventContext } from '@src/events/message/ctx/MessageCreateEventContext'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { AnyWritableChannel } from '@src/api/entities/channel/interfaces/AnyWritableChannel'

export class MessageCreateEvent extends AbstractEvent<MessageCreateEventContext> {
  public name = EventNames.MESSAGE_CREATE

  async execute(shardId: number, data: RawMessageData) {
    const Message = EntitiesUtil.get('Message')

    const message = await new Message(this.app).init(data)
    await this.app.messages.cache.set(message.id, message, { storage: message.channelId })

    let author = await this.app.users.cache.get(data.author.id)

    if (author) {
      author = await author.init(data.author)
    } else {
      const User = EntitiesUtil.get('User')
      author = await new User(this.app).init(data.author)
    }

    await this.app.users.cache.set(author.id, author)

    if (message.guildId && data.member) {
      let member = await this.app.members.cache.get(message.authorId, { storage: message.guildId })

      if (member) {
        member = await member.init(data.member)
      } else {
        const Member = EntitiesUtil.get('GuildMember')
        member = await new Member(this.app).init({ ...data.member, userId: message.authorId, guildId: message.guildId })
      }

      await this.app.members.cache.set(member.userId, member, { storage: message.guildId })
    }

    const channel = await this.app.channels.cache.get<AnyWritableChannel>(message.channelId, {
      storage: message.guildId ?? 'dm'
    })

    if (channel) {
      channel.lastMsgId = message.id
      await this.app.channels.cache.set(message.channelId, channel, {
        storage: message.guildId ?? 'dm'
      })
    }

    const context: MessageCreateEventContext = {
      shardId,
      message,
      author,
      channel,
      channelId: message.channelId,
      authorId: message.authorId,
      messageId: message.id,
    }

    this.app.emit(EventNames.MESSAGE_CREATE, context)
    return context
  }
}
