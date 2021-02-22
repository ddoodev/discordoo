import CacheCell from '../cache/CacheCell'
import {
  APIChannel,
  APIEmoji,
  APIGuild,
  APIGuildMember,
  APIMessage,
  APIUser,
  GatewayActivity
} from 'discord-api-types'

/**
 * Represents a shard-like structure
 *
 * Designed for certain abstractions, e.g. ShardsManager.all
 */
export default interface ShardLike {
  /**
   * Retrieve channels cache of this ShardLike structure
   *
   * @param guild - guild to get channels from. If not specified, will return cache for all channels
   */
  getChannelsCache(guild?: string): CacheCell<string, APIChannel>
  /**
   * Get emojis cache for specific guild
   *
   * @param guild - guild to get emojis from
   */
  getGuildEmojisCache(guild: string): CacheCell<string, APIEmoji>
  /**
   * Get guilds cache for this ShardLike structure
   */
  getGuildsCache(): CacheCell<string, APIGuild>
  /**
   * Get members cache for specific guild on this ShardLike structure
   *
   * @param guild - guild
   */
  getMembersCache(guild: string): CacheCell<string, APIGuildMember>
  /**
   * Get users cache for this ShardLike structure
   */
  getUsersCache(): CacheCell<string, APIUser>
  /**
   * Get all presences cached on this ShardLike structure
   */
  getPresencesCache(): CacheCell<string, GatewayActivity>
  /**
   * Get messages cache for this ShardLike structure
   * @param channel - channel id
   */
  getMessagesCache(channel: string): CacheCell<string, APIMessage>
}
