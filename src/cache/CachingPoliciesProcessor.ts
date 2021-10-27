import { Client, ClientOptions } from '@src/core'
import { NonOptional } from '@src/utils'
import {
  ChannelsCachingPolicy,
  EmojisCachingPolicy,
  GlobalCachingPolicy,
  GuildsCachingPolicy,
  MembersCachingPolicy,
  MessagesCachingPolicy,
  PresencesCachingPolicy,
  RolesCachingPolicy,
  StickersCachingPolicy,
  UsersCachingPolicy
} from '@src/constants'
import { Message, Role } from '@src/api'
import { asyncSome } from '@src/utils/asyncSome'

export class CachingPoliciesProcessor {
  public client: Client
  private options: NonOptional<ClientOptions, 'cache'>['cache'] // client cache options

  constructor(client: Client) {
    this.client = client
    this.options = this.client.options?.cache ?? {}
  }

  async global(entity: any): Promise<boolean | undefined> {
    if (this.options.global) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(await this.options.global.before?.(entity) ?? undefined)

      results.push(
        await asyncSome(this.options.global.policies, policy => {
          switch (policy) {
            case GlobalCachingPolicy.NONE:
              return false
            case GlobalCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(await this.options.global.after?.(entity) ?? undefined)

      // when results[0] is undefined - return results[2], else return results[0]
      // when results[2] is undefined - return results[1], else return results[2]
      return results[0] ?? results[2] ?? results[1]
    }
  }

  async channel(channel: any): Promise<boolean> {
    let result = true

    if (this.options.channels) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(await this.options.channels.before?.(channel) ?? undefined)

      results.push(
        await asyncSome(this.options.channels.policies, policy => {
          switch (policy) {
            case ChannelsCachingPolicy.CATEGORY:
              return channel.type === 'category'
            case ChannelsCachingPolicy.DM:
              return channel.type === 'dm'
            case ChannelsCachingPolicy.NEWS:
              return channel.type === 'news'
            case ChannelsCachingPolicy.NEWS_THREAD:
              return channel.type === 'newsThread'
            case ChannelsCachingPolicy.TEXT:
              return channel.type === 'text'
            case ChannelsCachingPolicy.STORE:
              return channel.type === 'store'
            case ChannelsCachingPolicy.VOICE:
              return channel.type === 'voice'
            case ChannelsCachingPolicy.STAGE_VOICE:
              return channel.type === 'stageVoice'
            case ChannelsCachingPolicy.PUBLIC_THREAD:
              return channel.type === 'publicThread'
            case ChannelsCachingPolicy.PRIVATE_THREAD:
              return channel.type === 'privateThread'
            case ChannelsCachingPolicy.NONE:
              return false
            case ChannelsCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(await this.options.channels.after?.(channel) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  async emoji(emoji: any): Promise<boolean> {
    let result = true

    if (this.options.emojis) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(await this.options.emojis.before?.(emoji) ?? undefined)

      results.push(
        await asyncSome(this.options.emojis.policies, policy => {
          switch (policy) {
            case EmojisCachingPolicy.NONE:
              return false
            case EmojisCachingPolicy.STATIC:
            case EmojisCachingPolicy.ANIMATED:
              return !!emoji.animated
            case EmojisCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(await this.options.emojis.after?.(emoji) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  async sticker(sticker: any): Promise<boolean> {
    let result = true

    if (this.options.stickers) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(await this.options.stickers.before?.(sticker) ?? undefined)

      results.push(
        await asyncSome(this.options.stickers.policies, policy => {
          switch (policy) {
            case StickersCachingPolicy.NONE:
              return false
            case StickersCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(await this.options.stickers.after?.(sticker) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  async guild(guild: any): Promise<boolean> {
    let result = true

    if (this.options.guilds) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(await this.options.guilds.before?.(guild) ?? undefined)

      results.push(
        await asyncSome(this.options.guilds.policies, policy => {
          switch (policy) {
            case GuildsCachingPolicy.NONE:
              return false
            case GuildsCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(await this.options.guilds.after?.(guild) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  async member(member: any): Promise<boolean> {
    let result = true

    if (this.options.members) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(await this.options.members.before?.(member) ?? undefined)

      results.push(
        await asyncSome(this.options.members.policies, policy => {
          switch (policy) {
            case MembersCachingPolicy.ONLINE:
              return member.presence.status === 'online'
            case MembersCachingPolicy.DND:
              return member.presence.status === 'dnd'
            case MembersCachingPolicy.IDLE:
              return member.presence.status === 'idle'
            case MembersCachingPolicy.OFFLINE:
              return member.presence.status === 'offline'
            case MembersCachingPolicy.OWNER:
              return member.guild.ownerId === member.id
            case MembersCachingPolicy.PENDING:
              return member.pending
            case MembersCachingPolicy.VOICE: // TODO
              break
            case MembersCachingPolicy.RECENT_MESSAGE: // TODO
              break
            case MembersCachingPolicy.NONE:
              return false
            case MembersCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(await this.options.members.after?.(member) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  async message(message: Message): Promise<boolean> {
    let result = true

    if (this.options.messages) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(await this.options.messages.before?.(message) ?? undefined)

      results.push(
        await asyncSome(this.options.messages.policies, policy => {
          switch (policy) {
            case MessagesCachingPolicy.BOTS:
              return !!message.author?.bot
            case MessagesCachingPolicy.USERS:
              return !message.author?.bot
            case MessagesCachingPolicy.NONE:
              return false
            case MessagesCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(await this.options.messages.after?.(message) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  async presence(presence: any): Promise<boolean> {
    let result = true

    if (this.options.presences) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(await this.options.presences.before?.(presence) ?? undefined)

      results.push(
        await asyncSome(this.options.presences.policies, policy => {
          switch (policy) {
            case PresencesCachingPolicy.NONE:
              return false
            case PresencesCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(await this.options.presences.after?.(presence) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  async role(role: Role): Promise<boolean> {
    let result = true

    if (this.options.roles) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(await this.options.roles.before?.(role) ?? undefined)

      results.push(
        await asyncSome(this.options.roles.policies, policy => {
          switch (policy) {
            case RolesCachingPolicy.EVERYONE:
              return role.id === role.guildId
            case RolesCachingPolicy.MANAGED:
              return role.managed
            case RolesCachingPolicy.NONE:
              return false
            case RolesCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(await this.options.roles.after?.(role) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  async user(user: any): Promise<boolean> {
    let result = true

    if (this.options.users) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(await this.options.users.before?.(user) ?? undefined)

      results.push(
        await asyncSome(this.options.users.policies, policy => {
          switch (policy) {
            case UsersCachingPolicy.NONE:
              return false
            case UsersCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(await this.options.users.after?.(user) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }
}
