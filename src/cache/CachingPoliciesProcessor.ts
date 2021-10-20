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
  RolesCachingPolicy, StickersCachingPolicy,
  UsersCachingPolicy
} from '@src/constants'
import { Message } from '@src/api'

export class CachingPoliciesProcessor {
  public client: Client
  private options: NonOptional<ClientOptions, 'cache'>['cache'] // client cache options

  constructor(client: Client) {
    this.client = client
    this.options = this.client.options?.cache ?? {}
  }

  global(entity: any): boolean | undefined {
    if (this.options.global) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(this.options.global.before?.(entity) ?? undefined)

      results.push(
        this.options.global.policies.some(policy => {
          switch (policy) {
            case GlobalCachingPolicy.NONE:
              return false
            case GlobalCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(this.options.global.after?.(entity) ?? undefined)

      // when results[0] is undefined - return results[2], else return results[0]
      // when results[2] is undefined - return results[1], else return results[2]
      return results[0] ?? results[2] ?? results[1]
    }
  }

  channel(channel: any): boolean {
    let result = true

    if (this.options.channels) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(this.options.channels.before?.(channel) ?? undefined)

      results.push(
        this.options.channels.policies.some(policy => {
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

      results.push(this.options.channels.after?.(channel) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  emoji(emoji: any): boolean {
    let result = true

    if (this.options.emojis) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(this.options.emojis.before?.(emoji) ?? undefined)

      results.push(
        this.options.emojis.policies.some(policy => {
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

      results.push(this.options.emojis.after?.(emoji) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  sticker(sticker: any): boolean {
    let result = true

    if (this.options.stickers) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(this.options.stickers.before?.(sticker) ?? undefined)

      results.push(
        this.options.stickers.policies.some(policy => {
          switch (policy) {
            case StickersCachingPolicy.NONE:
              return false
            case StickersCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(this.options.stickers.after?.(sticker) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  guild(guild: any): boolean {
    let result = true

    if (this.options.guilds) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(this.options.guilds.before?.(guild) ?? undefined)

      results.push(
        this.options.guilds.policies.some(policy => {
          switch (policy) {
            case GuildsCachingPolicy.NONE:
              return false
            case GuildsCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(this.options.guilds.after?.(guild) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  member(member: any): boolean {
    let result = true

    if (this.options.members) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(this.options.members.before?.(member) ?? undefined)

      results.push(
        this.options.members.policies.some(policy => {
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

      results.push(this.options.members.after?.(member) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  message(message: Message): boolean {
    let result = true

    if (this.options.messages) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(this.options.messages.before?.(message) ?? undefined)

      results.push(
        this.options.messages.policies.some(policy => {
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

      results.push(this.options.messages.after?.(message) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  presence(presence: any): boolean {
    let result = true

    if (this.options.presences) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(this.options.presences.before?.(presence) ?? undefined)

      results.push(
        this.options.presences.policies.some(policy => {
          switch (policy) {
            case PresencesCachingPolicy.NONE:
              return false
            case PresencesCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(this.options.presences.after?.(presence) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  roles(role: any): boolean {
    let result = true

    if (this.options.roles) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(this.options.roles.before?.(role) ?? undefined)

      results.push(
        this.options.roles.policies.some(policy => {
          switch (policy) {
            case RolesCachingPolicy.EVERYONE:
              return role.id === role.guild.id
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

      results.push(this.options.roles.after?.(role) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }

  user(user: any): boolean {
    let result = true

    if (this.options.users) {
      const results: any[] /* [ boolean | undefined, boolean, boolean | undefined ] */ = []

      results.push(this.options.users.before?.(user) ?? undefined)

      results.push(
        this.options.users.policies.some(policy => {
          switch (policy) {
            case UsersCachingPolicy.NONE:
              return false
            case UsersCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      results.push(this.options.users.after?.(user) ?? undefined)

      result = results[0] ?? results[2] ?? results[1]
    }

    return result
  }
}
