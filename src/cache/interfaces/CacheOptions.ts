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
} from '@src/api'
import { Entities } from '@src/api/entities/Entities'

export const CACHE_OPTIONS_KEYS_LENGTH = 15 // all cache options expect 'global'

export type AnyEntity = typeof Entities[keyof typeof Entities]

/**
 * The CacheOptionsCell interface represents the options for caching a specific entity type with a specific caching policy.
 * @template Entity - Entity to cache.
 * @template Policy - Caching policy.
 */
export interface CacheOptionsCell<Entity, Policy> {
  /**
   * The custom function to determine whether to cache the entity.
   * @param entity
   */
  custom?: (entity: Entity) => boolean | Promise<boolean>
  /**
   * The caching policy for this type of entity.
   */
  policies: Policy[]
}

/**
 * Represents the options for managing caching of different entity types.
 */
export interface CacheOptions {
  /**
   * The caching options for channels.
   */
  channels?: CacheOptionsCell<AnyChannel, ChannelsCachingPolicy>

  /**
   * The caching options for commands.
   */
  commands?: CacheOptionsCell<AppCommand, AppCommandsCachingPolicy>

  /**
   * The caching options for emojis.
   */
  emojis?: CacheOptionsCell<AnyEmoji, EmojisCachingPolicy>

  /**
   * The caching options for global entities.
   */
  global?: CacheOptionsCell<AnyEntity, GlobalCachingPolicy>

  /**
   * The caching options for guilds.
   */
  guilds?: CacheOptionsCell<Guild, GuildsCachingPolicy>

  /**
   * The caching options for invite guilds.
   */
  inviteGuilds?: CacheOptionsCell<InviteGuild, InvitesCachingPolicy>

  /**
   * The caching options for invites.
   */
  invites?: CacheOptionsCell<Invite, InvitesCachingPolicy>

  /**
   * The caching options for guild members.
   */
  members?: CacheOptionsCell<GuildMember, GuildMembersCachingPolicy>

  /**
   * The caching options for messages.
   */
  messages?: CacheOptionsCell<Message, MessagesCachingPolicy>

  /**
   * The caching options for permission overwrites.
   */
  overwrites?: CacheOptionsCell<PermissionOverwrite, OverwritesCachingPolicy>

  /**
   * The caching options for presences.
   */
  presences?: CacheOptionsCell<Presence, PresencesCachingPolicy>

  /**
   * The caching options for reactions.
   */
  reactions?: CacheOptionsCell<MessageReaction, ReactionsCachingPolicy>

  /**
   * The caching options for roles.
   */
  roles?: CacheOptionsCell<Role, RolesCachingPolicy>

  /**
   * The caching options for stickers.
   */
  stickers?: CacheOptionsCell<Sticker, StickersCachingPolicy>

  /**
   * The caching options for thread members.
   */
  threadMembers?: CacheOptionsCell<ThreadMember, ThreadMembersCachingPolicy>

  /**
   * The caching options for users.
   */
  users?: CacheOptionsCell<User, UsersCachingPolicy>
}
