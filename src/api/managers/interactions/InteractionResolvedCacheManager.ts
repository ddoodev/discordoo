import { EntitiesManager } from '../../../../src/api/managers/EntitiesManager'
import {
  AnyInteractionResolvedChannel,
  EntitiesUtil,
  GuildMember,
  InteractionResolvedCacheManagerData,
  InteractionResolvedChannel,
  InteractionResolvedThreadChannel,
  Message,
  MessageAttachment,
  Role,
  User
} from '../../../../src/api'
import { RestEligibleDiscordApplication } from '../../../../src/core'
import { Collection } from '../../../../../collection/src/_index'
import { ChannelTypes } from '../../../../src/constants'

export class InteractionResolvedCacheManager extends EntitiesManager {
  public channels: Collection<string, AnyInteractionResolvedChannel> = new Collection()
  public messages: Collection<string, Message> = new Collection()
  public members: Collection<string, GuildMember> = new Collection()
  public roles: Collection<string, Role> = new Collection()
  public users: Collection<string, User> = new Collection()
  public attachments: Collection<string, MessageAttachment> = new Collection()

  constructor(app: RestEligibleDiscordApplication) {
    super(app)
  }

  async init(data: InteractionResolvedCacheManagerData) {
    // console.log(data)
    if (data.channels) {
      for await (const channelData of Object.values(data.channels)) {
        let Channel: typeof InteractionResolvedThreadChannel | typeof InteractionResolvedChannel

        switch (channelData.type) {
          case ChannelTypes.GuildPublicThread:
          case ChannelTypes.GuildPrivateThread:
          case ChannelTypes.GuildNewsThread:
            Channel = EntitiesUtil.get('InteractionResolvedThreadChannel')
            break
          default:
            Channel = EntitiesUtil.get('InteractionResolvedChannel')
        }

        const channel = await new Channel(this.app).init(channelData as any)

        // cannot add partial channel to cache
        // await this.app.channels.cache.set(channel.id, channel, { storage: data.guildId ?? 'dm' })
        this.channels.set(channel.id, channel)
      }
    }

    if (data.messages) {
      for await (const messageData of Object.values(data.messages)) {
        const Message = EntitiesUtil.get('Message')
        const message = await new Message(this.app).init(messageData)

        await this.app.messages.cache.set(message.id, message, { storage: message.channelId })
        this.messages.set(message.id, message)
      }
    }

    if (data.members) {
      // need entries for ID because memberData does not contain ID. little performance waste
      for await (const [ id, memberData ] of Object.entries(data.members)) {
        const Member = EntitiesUtil.get('GuildMember')
        const member = await new Member(this.app).init({ ...memberData, userId: id, guildId: data.guildId })

        await this.app.members.cache.set(member.userId, member, { storage: member.guildId })
        this.members.set(member.userId, member)
      }
    }

    if (data.roles) {
      for await (const roleData of Object.values(data.roles)) {
        const Role = EntitiesUtil.get('Role')
        const role = await new Role(this.app).init(roleData)

        await this.app.roles.cache.set(role.id, role, { storage: role.guildId })
        this.roles.set(role.id, role)
      }
    }

    if (data.users) {
      for await (const userData of Object.values(data.users)) {
        const User = EntitiesUtil.get('User')
        const user = await new User(this.app).init(userData)

        await this.app.users.cache.set(user.id, user)
        this.users.set(user.id, user)
      }
    }

    if (data.attachments) {
      for await (const attachmentData of Object.values(data.attachments)) {
        const MessageAttachment = EntitiesUtil.get('MessageAttachment')
        const messageAttachment = await new MessageAttachment(this.app).init(attachmentData)

        // not cached in app
        this.attachments.set(attachmentData.id, messageAttachment)
      }
    }

    return this
  }
}
