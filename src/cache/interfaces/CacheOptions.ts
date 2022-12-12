import {
  ChannelsCachingPolicy,
  EmojisCachingPolicy,
  GlobalCachingPolicy,
  GuildsCachingPolicy,
  GuildMembersCachingPolicy,
  MessagesCachingPolicy,
  OverwritesCachingPolicy,
  PresencesCachingPolicy,
  ReactionsCachingPolicy,
  RolesCachingPolicy,
  StickersCachingPolicy,
  ThreadMembersCachingPolicy,
  UsersCachingPolicy,
  InvitesCachingPolicy,
  AppCommandsCachingPolicy
} from '@src/constants'
import {
  AnyEmoji,
  AnyChannel,
  Guild,
  GuildMember,
  Invite,
  InviteGuild,
  Message,
  Presence,
  Role,
  Sticker,
  User,
  ThreadMember,
  MessageReaction,
  PermissionOverwrite,
  AppCommand,
  AppCommandOption,
} from '@src/api'
import { Entities } from '@src/api/entities/Entities'

export const CACHE_OPTIONS_KEYS_LENGTH = 15 // all cache options expect 'global'

export type AnyEntity = typeof Entities[keyof typeof Entities]

export interface CacheOptions {
  channels?: {
    custom?: (channel: AnyChannel) => boolean | Promise<boolean>
    policies: ChannelsCachingPolicy[]
  }

  emojis?: {
    custom?: (emoji: AnyEmoji) => boolean | Promise<boolean>
    policies: EmojisCachingPolicy[]
  }

  global?: {
    custom?: (entity: AnyEntity) => boolean | Promise<boolean>
    policies: GlobalCachingPolicy[]
  }

  invites?: {
    custom?: (invite: Invite) => boolean | Promise<boolean>
    policies: InvitesCachingPolicy[]
  }

  inviteGuilds?: {
    custom?: (inviteGuild: InviteGuild) => boolean | Promise<boolean>
    policies: InvitesCachingPolicy[]
  }

  guilds?: {
    custom?: (guild: Guild) => boolean | Promise<boolean>
    policies: GuildsCachingPolicy[]
  }

  members?: {
    custom?: (member: GuildMember) => boolean | Promise<boolean>
    policies: GuildMembersCachingPolicy[]
  }

  messages?: {
    custom?: (message: Message) => boolean | Promise<boolean>
    lifetime?: number
    policies: MessagesCachingPolicy[]
  }

  presences?: {
    custom?: (presence: Presence) => boolean | Promise<boolean>
    policies: PresencesCachingPolicy[]
  }

  roles?: {
    custom?: (role: Role) => boolean | Promise<boolean>
    policies: RolesCachingPolicy[]
  }

  users?: {
    custom?: (user: User) => boolean | Promise<boolean>
    policies: UsersCachingPolicy[]
  }

  stickers?: {
    custom?: (sticker: Sticker) => boolean | Promise<boolean>
    policies: StickersCachingPolicy[]
  }

  reactions?: {
    custom?: (reaction: MessageReaction) => boolean | Promise<boolean>
    policies: ReactionsCachingPolicy[]
  }

  overwrites?: {
    custom?: (overwrite: PermissionOverwrite) => boolean | Promise<boolean>
    policies: OverwritesCachingPolicy[]
  }

  threadMembers?: {
    custom?: (threadMember: ThreadMember) => boolean | Promise<boolean>
    policies: ThreadMembersCachingPolicy[]
  }

  commands?: {
    custom?: (command: AppCommand) => boolean | Promise<boolean>
    policies: AppCommandsCachingPolicy[]
  }
}
