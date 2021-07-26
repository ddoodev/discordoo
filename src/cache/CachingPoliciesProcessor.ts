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
  UsersCachingPolicy
} from '@src/constants'

export class CachingPoliciesProcessor {
  public client: Client
  private options: NonOptional<ClientOptions, 'cache'>['cache']

  constructor(client: Client) {
    this.client = client
    this.options = this.client.options?.cache ?? {}
  }

  global(entity): boolean | undefined {
    if (this.options.global) {
      const results: boolean[] = []

      results.push(this.options.global.before?.(entity) ?? true)

      results.push(
        this.options.global.policies.some(policy => {
          switch (policy) {
            case GlobalCachingPolicy.ALL:
              return true
            case GlobalCachingPolicy.NONE:
              return false
            default:
              return true
          }
        })
      )

      results.push(this.options.global.after?.(entity) ?? true)

      // when results[0] is false - returns false
      // when results[2] is false - returns false
      // else returns results[1]
      return results[0] && (results[2] && results[1])
    }
  }

  channel(channel: any): boolean {
    let result = true

    if (this.options.channels) {
      const results: boolean[] = []

      results.push(this.options.channels.before?.(channel) ?? true)

      results.push(
        this.options.channels.policies.some(policy => {
          switch (policy) {
            case ChannelsCachingPolicy.ALL:
              return true
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
            default:
              return true
          }
        })
      )

      results.push(this.options.channels.after?.(channel) ?? true)

      result = results[0] && (results[2] && results[1])
    }

    return result
  }

  emoji(emoji: any): boolean {
    let result = true

    if (this.options.emojis) {
      const results: boolean[] = []

      results.push(this.options.emojis.before?.(emoji) ?? true)

      results.push(
        this.options.emojis.policies.some(policy => {
          switch (policy) {
            case EmojisCachingPolicy.ALL:
              return true
            case EmojisCachingPolicy.NONE:
              return false
            case EmojisCachingPolicy.STATIC:
            case EmojisCachingPolicy.ANIMATED:
              return !!emoji.animated
            default:
              return true
          }
        })
      )

      results.push(this.options.emojis.after?.(emoji) ?? true)

      result = results[0] && (results[2] && results[1])
    }

    return result
  }

  guild(guild: any): boolean {
    let result = true

    if (this.options.guilds) {
      const results: boolean[] = []

      results.push(this.options.guilds.before?.(guild) ?? true)

      results.push(
        this.options.guilds.policies.some(policy => {
          switch (policy) {
            case GuildsCachingPolicy.ALL:
              return true
            case GuildsCachingPolicy.NONE:
              return true
            default:
              return true
          }
        })
      )

      results.push(this.options.guilds.after?.(guild) ?? true)

      result = results[0] && (results[2] && results[1])
    }

    return result
  }

  member(member: any): boolean {
    let result = true

    if (this.options.members) {
      const results: boolean[] = []

      results.push(this.options.members.before?.(member) ?? true)

      results.push(
        this.options.members.policies.some(policy => {
          switch (policy) {
            case MembersCachingPolicy.ALL:
              return true
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
            default:
              return true
          }
        })
      )

      results.push(this.options.members.after?.(member) ?? true)

      result = results[0] && (results[2] && results[1])
    }

    return result
  }

  message(message: any): boolean {
    let result = true

    if (this.options.messages) {
      const results: boolean[] = []

      results.push(this.options.messages.before?.(message) ?? true)

      results.push(
        this.options.messages.policies.some(policy => {
          switch (policy) {
            case MessagesCachingPolicy.ALL:
              return true
            case MessagesCachingPolicy.BOTS:
              return message.author.bot
            case MessagesCachingPolicy.USERS:
              return !message.author.bot
            case MessagesCachingPolicy.NONE:
              return false
            default:
              return true
          }
        })
      )

      results.push(this.options.messages.after?.(message) ?? true)

      result = results[0] && (results[2] && results[1])
    }

    return result
  }

  presence(presence: any): boolean {
    let result = true

    if (this.options.presences) {
      const results: boolean[] = []

      results.push(this.options.presences.before?.(presence) ?? true)

      results.push(
        this.options.presences.policies.some(policy => {
          switch (policy) {
            case PresencesCachingPolicy.ALL:
              return true
            case PresencesCachingPolicy.NONE:
              return false
            default:
              return true
          }
        })
      )

      results.push(this.options.presences.after?.(presence) ?? true)

      result = results[0] && (results[2] && results[1])
    }

    return result
  }

  roles(role: any): boolean {
    let result = true

    if (this.options.roles) {
      const results: boolean[] = []

      results.push(this.options.roles.before?.(role) ?? true)

      results.push(
        this.options.roles.policies.some(policy => {
          switch (policy) {
            case RolesCachingPolicy.ALL:
              return true
            case RolesCachingPolicy.EVERYONE:
              return role.id === role.guild.id
            case RolesCachingPolicy.MANAGED:
              return role.managed
            case RolesCachingPolicy.NONE:
              return false
            default:
              return true
          }
        })
      )

      results.push(this.options.roles.after?.(role) ?? true)

      result = results[0] && (results[2] && results[1])
    }

    return result
  }

  user(user: any): boolean {
    let result = true

    if (this.options.users) {
      const results: boolean[] = []

      results.push(this.options.users.before?.(user) ?? true)

      results.push(
        this.options.users.policies.some(policy => {
          switch (policy) {
            case UsersCachingPolicy.ALL:
              return true
            case UsersCachingPolicy.NONE:
              return false
            default:
              return true
          }
        })
      )

      results.push(this.options.users.after?.(user) ?? true)

      result = results[0] && (results[2] && results[1])
    }

    return result
  }
}
