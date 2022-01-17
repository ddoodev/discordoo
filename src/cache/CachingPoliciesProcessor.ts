import { Client, ClientOptions } from '@src/core'
import { NonOptional } from '@src/utils'
import {
  ChannelsCachingPolicy,
  EmojisCachingPolicy,
  GlobalCachingPolicy,
  GuildsCachingPolicy,
  GuildMembersCachingPolicy,
  MessagesCachingPolicy,
  OverwritesCachingPolicy,
  PermissionOverwriteTypes,
  PresencesCachingPolicy,
  RolesCachingPolicy,
  StickerFormatTypes,
  StickersCachingPolicy,
  StickerTypes,
  UsersCachingPolicy,
  ThreadMembersCachingPolicy,
  ReactionsCachingPolicy
} from '@src/constants'
import {
  ActivityEmoji,
  AnyEmoji,
  GuildEmoji,
  GuildMember,
  Message,
  MessageReaction,
  Presence,
  ReactionEmoji,
  Role,
  Sticker,
  ThreadMember,
  User,
  PermissionOverwrite
} from '@src/api'

export class CachingPoliciesProcessor {
  public client: Client
  private options: NonOptional<ClientOptions, 'cache'>['cache'] // client cache options

  constructor(client: Client) {
    this.client = client
    this.options = this.client.options?.cache ?? {}
  }

  async global(entity: any): Promise<boolean | undefined> {
    if (this.options.global) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.global.custom?.(entity) ?? undefined)

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

      // when results[0] is undefined - return results[1], else return results[0]
      return results[0] ?? results[1]
    }
  }

  async channels(channel: any): Promise<boolean> {
    let result = true

    if (this.options.channels) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.channels.custom?.(channel) ?? undefined)

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

      result = results[0] ?? results[1]
    }

    return result
  }

  async emojis(emoji: AnyEmoji): Promise<boolean> {
    let result = true

    if (this.options.emojis) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.emojis.custom?.(emoji) ?? undefined)

      results.push(
        this.options.emojis.policies.some(policy => {
          switch (policy) {
            case EmojisCachingPolicy.NONE:
              return false
            case EmojisCachingPolicy.GUILD:
              return emoji instanceof GuildEmoji
            case EmojisCachingPolicy.ACTIVITY:
              return emoji instanceof ActivityEmoji
            case EmojisCachingPolicy.REACTION:
              return emoji instanceof ReactionEmoji
            case EmojisCachingPolicy.STATIC:
            case EmojisCachingPolicy.ANIMATED:
              return !!emoji.animated
            case EmojisCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      result = results[0] ?? results[1]
    }

    return result
  }

  async stickers(sticker: Sticker): Promise<boolean> {
    let result = true

    if (this.options.stickers) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.stickers.custom?.(sticker) ?? undefined)

      results.push(
        this.options.stickers.policies.some(policy => {
          switch (policy) {
            case StickersCachingPolicy.NONE:
              return false
            case StickersCachingPolicy.STANDARD:
              return sticker.type === StickerTypes.STANDARD
            case StickersCachingPolicy.GUILD:
              return sticker.type === StickerTypes.GUILD
            case StickersCachingPolicy.PNG:
              return sticker.formatType === StickerFormatTypes.PNG
            case StickersCachingPolicy.APNG:
              return sticker.formatType === StickerFormatTypes.APNG
            case StickersCachingPolicy.LOTTIE:
              return sticker.formatType === StickerFormatTypes.LOTTIE
            case StickersCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      result = results[0] ?? results[1]
    }

    return result
  }

  async threadMembers(member: ThreadMember): Promise<boolean> {
    let result = true

    if (this.options.threadMembers) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.threadMembers.custom?.(member) ?? undefined)

      results.push(
        this.options.threadMembers.policies.some(policy => {
          switch (policy) {
            case ThreadMembersCachingPolicy.NONE:
              return false
            case ThreadMembersCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      result = results[0] ?? results[1]
    }

    return result
  }

  async reactions(reaction: MessageReaction): Promise<boolean> {
    let result = true

    if (this.options.reactions) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.reactions.custom?.(reaction) ?? undefined)

      results.push(
        this.options.reactions.policies.some(policy => {
          switch (policy) {
            case ReactionsCachingPolicy.NONE:
              return false
            case ReactionsCachingPolicy.OWN:
              return reaction.me
            case ReactionsCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      result = results[0] ?? results[1]
    }

    return result
  }

  async guilds(guild: any): Promise<boolean> {
    let result = true

    if (this.options.guilds) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.guilds.custom?.(guild) ?? undefined)

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

      result = results[0] ?? results[1]
    }

    return result
  }

  async members(member: GuildMember): Promise<boolean> {
    let result = true

    if (this.options.members) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = [],
        presence = await member.presence()

      results.push(await this.options.members.custom?.(member) ?? undefined)

      results.push(
        this.options.members.policies.some(policy => {
          switch (policy) {
            case GuildMembersCachingPolicy.ONLINE:
              return presence?.status === 'online'
            case GuildMembersCachingPolicy.DND:
              return presence?.status === 'dnd'
            case GuildMembersCachingPolicy.IDLE:
              return presence?.status === 'idle'
            case GuildMembersCachingPolicy.OFFLINE:
              return presence?.status === 'offline'
            case GuildMembersCachingPolicy.OWNER:
              return member.guildOwner
            case GuildMembersCachingPolicy.PENDING:
              return !!member.pending
            case GuildMembersCachingPolicy.VOICE: // TODO
              return false
            case GuildMembersCachingPolicy.RECENT_MESSAGE: // TODO
              return false
            case GuildMembersCachingPolicy.NONE:
              return false
            case GuildMembersCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      result = results[0] ?? results[1]
    }

    return result
  }

  async messages(message: Message): Promise<boolean> {
    let result = true

    if (this.options.messages) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.messages.custom?.(message) ?? undefined)

      results.push(
        this.options.messages.policies.some(async policy => {
          const author = await message.author()
          switch (policy) {
            case MessagesCachingPolicy.BOTS:
              return !!author?.bot
            case MessagesCachingPolicy.USERS:
              return !author?.bot
            case MessagesCachingPolicy.NONE:
              return false
            case MessagesCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      result = results[0] ?? results[1]
    }

    return result
  }

  async presences(presence: Presence): Promise<boolean> { // TODO
    let result = true

    if (this.options.presences) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.presences.custom?.(presence) ?? undefined)

      results.push(
        this.options.presences.policies.some(policy => {
          switch (policy) {
            case PresencesCachingPolicy.NONE:
              return false
            case PresencesCachingPolicy.ONLINE:
              return presence.status === 'online'
            case PresencesCachingPolicy.IDLE:
              return presence.status === 'idle'
            case PresencesCachingPolicy.DND:
              return presence.status === 'dnd'
            case PresencesCachingPolicy.OFFLINE:
              return presence.status === 'offline'
            case PresencesCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      result = results[0] ?? results[1]
    }

    return result
  }

  async overwrites(overwrite: PermissionOverwrite): Promise<boolean> {
    let result = true

    if (this.options.overwrites) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.overwrites.custom?.(overwrite) ?? undefined)

      results.push(
        this.options.overwrites.policies.some(policy => {
          switch (policy) {
            case OverwritesCachingPolicy.NONE:
              return false
            case OverwritesCachingPolicy.MEMBERS:
              return overwrite.type === PermissionOverwriteTypes.MEMBER
            case OverwritesCachingPolicy.ROLES:
              return overwrite.type === PermissionOverwriteTypes.ROLE
            case OverwritesCachingPolicy.ALL:
            default:
              return true
          }
        })
      )

      result = results[0] ?? results[1]
    }

    return result
  }

  async roles(role: Role): Promise<boolean> {
    let result = true

    if (this.options.roles) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.roles.custom?.(role) ?? undefined)

      results.push(
        this.options.roles.policies.some(policy => {
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

      result = results[0] ?? results[1]
    }

    return result
  }

  async users(user: User): Promise<boolean> {
    let result = true

    if (this.options.users) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.users.custom?.(user) ?? undefined)

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

      result = results[0] ?? results[1]
    }

    return result
  }
}
