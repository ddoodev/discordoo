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
  UsersCachingPolicy
} from '@src/constants'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'
import { AnyChannel } from '@src/api/entities/channel/interfaces/AnyChannel'
import { AnyEmoji, GuildMember, Message, Presence, Role, Sticker, User } from '@src/api'
import { MessageReaction } from '@src/api/entities/reaction/MessageReaction'
import { PermissionOverwrite } from '@src/api/entities/overwrite/PermissionOverwrite'

export const CACHE_OPTIONS_KEYS_LENGTH = 12 // all cache options expect 'global'

export type AnyEntity = AnyChannel
  | AnyEmoji
  | any /* TODO: Guild */
  | GuildMember
  | Message
  | Presence
  | Role
  | User
  | Sticker
  | MessageReaction
  | PermissionOverwrite
  | ThreadMember

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

  guilds?: {
    custom?: (guild: any) => boolean | Promise<boolean>
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
}
