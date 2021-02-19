import CoreModule from '../CoreModule'
import CacheCell from './CacheCell'
import {
  APIEmoji,
  APIChannel,
  APIGuild,
  APIGuildMember,
  APIUser,
  GatewayActivity,
  APIMessage
} from 'discord-api-types'

/**
 * Represents a single cache module
 *
 * @template T - cache types
 */
export default interface CacheModule extends CoreModule {
  createCache<K extends CacheCell<any, any>>(type: string): K
  getCache<K extends CacheCell<any, any>>(type: string): K | undefined
  getChannelCache(guild?: string): CacheCell<string, APIChannel>
  getGuildEmojiCache(guild: string): CacheCell<string, APIEmoji>
  getGuildCache(): CacheCell<string, APIGuild>
  getMemberCache(guild: string): CacheCell<string, APIGuildMember>
  getUserCache(): CacheCell<string, APIUser>
  getPresencesCache(): CacheCell<string, GatewayActivity>
  getMessagesCache(channel: string): CacheCell<string, APIMessage>
}