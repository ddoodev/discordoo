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

export interface CachingOptions {
  channels?: {
    before?: (channel: any) => boolean
    policies: ChannelsCachingPolicy[]
    after?: (channel: any) => boolean
  }

  emojis?: {
    before?: (emoji: any) => boolean
    policies: EmojisCachingPolicy[]
    after?: (emoji: any) => boolean
  }

  global?: {
    before?: (entity: any) => boolean
    policies: GlobalCachingPolicy[]
    after?: (entity: any) => boolean
  }

  guilds?: {
    before?: (guild: any) => boolean
    policies: GuildsCachingPolicy[]
    after?: (guild: any) => boolean
  }

  members?: {
    before?: (member: any) => boolean
    policies: MembersCachingPolicy[]
    after?: (member: any) => boolean
  }

  messages?: {
    before?: (emoji: any) => boolean
    lifetime?: number
    policies: MessagesCachingPolicy[]
    after?: (emoji: any) => boolean
  }

  presences?: {
    before?: (presence: any) => boolean
    policies: PresencesCachingPolicy[]
    after?: (presence: any) => boolean
  }

  roles?: {
    before?: (role: any) => boolean
    policies: RolesCachingPolicy[]
    after?: (role: any) => boolean
  }

  users?: {
    before?: (user: any) => boolean
    policies: UsersCachingPolicy[]
    after?: (user: any) => boolean
  }

  stickers?: {
    before?: (sticker: any) => boolean
    policies: StickersCachingPolicy[]
    after?: (sticker: any) => boolean
  }
}
