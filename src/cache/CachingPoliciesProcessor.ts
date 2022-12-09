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
  ReactionsCachingPolicy, InvitesCachingPolicy
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
  PermissionOverwrite, Invite, InviteGuild
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
            case GlobalCachingPolicy.None:
              return false
            case GlobalCachingPolicy.All:
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
            case ChannelsCachingPolicy.Category:
              return channel.type === 'category'
            case ChannelsCachingPolicy.Dm:
              return channel.type === 'dm'
            case ChannelsCachingPolicy.News:
              return channel.type === 'news'
            case ChannelsCachingPolicy.NewsThread:
              return channel.type === 'newsThread'
            case ChannelsCachingPolicy.Text:
              return channel.type === 'text'
            case ChannelsCachingPolicy.Store:
              return channel.type === 'store'
            case ChannelsCachingPolicy.Voice:
              return channel.type === 'voice'
            case ChannelsCachingPolicy.StageVoice:
              return channel.type === 'stageVoice'
            case ChannelsCachingPolicy.PublicThread:
              return channel.type === 'publicThread'
            case ChannelsCachingPolicy.PrivateThread:
              return channel.type === 'privateThread'
            case ChannelsCachingPolicy.None:
              return false
            case ChannelsCachingPolicy.All:
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
            case EmojisCachingPolicy.None:
              return false
            case EmojisCachingPolicy.Guild:
              return emoji instanceof GuildEmoji
            case EmojisCachingPolicy.Activity:
              return emoji instanceof ActivityEmoji
            case EmojisCachingPolicy.Reaction:
              return emoji instanceof ReactionEmoji
            case EmojisCachingPolicy.Static:
            case EmojisCachingPolicy.Animated:
              return !!emoji.animated
            case EmojisCachingPolicy.All:
            default:
              return true
          }
        })
      )

      result = results[0] ?? results[1]
    }

    return result
  }

  async inviteGuilds(inviteGuild: InviteGuild): Promise<boolean> {
    let result = true

    if (this.options.inviteGuilds) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.inviteGuilds.custom?.(inviteGuild) ?? undefined)

      results.push(
        this.options.inviteGuilds.policies.some(policy => {
          switch (policy) {
            case InvitesCachingPolicy.None:
              return false
            case InvitesCachingPolicy.All:
            default:
              return true
          }
        })
      )

      result = results[0] ?? results[1]
    }

    return result
  }

  async invites(invite: Invite): Promise<boolean> {
    let result = true

    if (this.options.invites) {
      const results: any[] /* [ boolean | undefined, boolean ] */ = []

      results.push(await this.options.invites.custom?.(invite) ?? undefined)

      results.push(
        this.options.invites.policies.some(policy => {
          switch (policy) {
            case InvitesCachingPolicy.None:
              return false
            case InvitesCachingPolicy.All:
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
            case StickersCachingPolicy.None:
              return false
            case StickersCachingPolicy.Standard:
              return sticker.type === StickerTypes.Standard
            case StickersCachingPolicy.Guild:
              return sticker.type === StickerTypes.Guild
            case StickersCachingPolicy.Png:
              return sticker.formatType === StickerFormatTypes.Png
            case StickersCachingPolicy.Apng:
              return sticker.formatType === StickerFormatTypes.Apng
            case StickersCachingPolicy.Lottie:
              return sticker.formatType === StickerFormatTypes.Lottie
            case StickersCachingPolicy.All:
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
            case ThreadMembersCachingPolicy.None:
              return false
            case ThreadMembersCachingPolicy.All:
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
            case ReactionsCachingPolicy.None:
              return false
            case ReactionsCachingPolicy.Own:
              return reaction.me
            case ReactionsCachingPolicy.All:
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
            case GuildsCachingPolicy.None:
              return false
            case GuildsCachingPolicy.All:
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
            case GuildMembersCachingPolicy.Online:
              return presence?.status === 'online'
            case GuildMembersCachingPolicy.Dnd:
              return presence?.status === 'dnd'
            case GuildMembersCachingPolicy.Idle:
              return presence?.status === 'idle'
            case GuildMembersCachingPolicy.Offline:
              return presence?.status === 'offline'
            case GuildMembersCachingPolicy.Owner:
              return member.guildOwner
            case GuildMembersCachingPolicy.Pending:
              return !!member.pending
            case GuildMembersCachingPolicy.Voice: // TODO
              return false
            case GuildMembersCachingPolicy.RecentMessage: // TODO
              return false
            case GuildMembersCachingPolicy.None:
              return false
            case GuildMembersCachingPolicy.All:
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
            case MessagesCachingPolicy.Bots:
              return !!author?.bot
            case MessagesCachingPolicy.Users:
              return !author?.bot
            case MessagesCachingPolicy.None:
              return false
            case MessagesCachingPolicy.All:
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
            case PresencesCachingPolicy.None:
              return false
            case PresencesCachingPolicy.Online:
              return presence.status === 'online'
            case PresencesCachingPolicy.Idle:
              return presence.status === 'idle'
            case PresencesCachingPolicy.Dnd:
              return presence.status === 'dnd'
            case PresencesCachingPolicy.Offline:
              return presence.status === 'offline'
            case PresencesCachingPolicy.All:
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
            case OverwritesCachingPolicy.None:
              return false
            case OverwritesCachingPolicy.Members:
              return overwrite.type === PermissionOverwriteTypes.Member
            case OverwritesCachingPolicy.Roles:
              return overwrite.type === PermissionOverwriteTypes.Role
            case OverwritesCachingPolicy.All:
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
            case RolesCachingPolicy.Everyone:
              return role.id === role.guildId
            case RolesCachingPolicy.Managed:
              return role.managed
            case RolesCachingPolicy.None:
              return false
            case RolesCachingPolicy.All:
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
            case UsersCachingPolicy.None:
              return false
            case UsersCachingPolicy.All:
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
