import {
  ChannelsCachingPolicy,
  EmojisCachingPolicy,
  GlobalCachingPolicy,
  GuildsCachingPolicy,
  MembersCachingPolicy,
  MessagesCachingPolicy,
  OverwritesCachingPolicy,
  PresencesCachingPolicy,
  ReactionsCachingPolicy,
  RolesCachingPolicy,
  StickersCachingPolicy,
  UsersCachingPolicy
} from '@src/constants'

export const CACHE_OPTIONS_KEYS_LENGTH = 11 // all cache options expect 'global'

export interface CacheOptions {
  channels?: {
    custom?: (channel: any) => boolean | Promise<boolean>
    policies: ChannelsCachingPolicy[]
  }

  emojis?: {
    custom?: (emoji: any) => boolean | Promise<boolean>
    policies: EmojisCachingPolicy[]
  }

  global?: {
    custom?: (entity: any) => boolean | Promise<boolean>
    policies: GlobalCachingPolicy[]
  }

  guilds?: {
    custom?: (guild: any) => boolean | Promise<boolean>
    policies: GuildsCachingPolicy[]
  }

  members?: {
    custom?: (member: any) => boolean | Promise<boolean>
    policies: MembersCachingPolicy[]
  }

  messages?: {
    custom?: (emoji: any) => boolean | Promise<boolean>
    lifetime?: number
    policies: MessagesCachingPolicy[]
  }

  presences?: {
    custom?: (presence: any) => boolean | Promise<boolean>
    policies: PresencesCachingPolicy[]
  }

  roles?: {
    custom?: (role: any) => boolean | Promise<boolean>
    policies: RolesCachingPolicy[]
  }

  users?: {
    custom?: (user: any) => boolean | Promise<boolean>
    policies: UsersCachingPolicy[]
  }

  stickers?: {
    custom?: (sticker: any) => boolean | Promise<boolean>
    policies: StickersCachingPolicy[]
  }

  reactions?: {
    custom?: (reaction: any) => boolean | Promise<boolean>
    policies: ReactionsCachingPolicy[]
  }

  overwrites?: {
    custom?: (overwrite: any) => boolean | Promise<boolean>
    policies: OverwritesCachingPolicy[]
  }
}
