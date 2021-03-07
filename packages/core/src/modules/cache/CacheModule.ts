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
  getChannelsCache(guild?: string): CacheCell<string, APIChannel>
  getGuildEmojisCache(guild: string): CacheCell<string, APIEmoji>
  getGuildsCache(): CacheCell<string, APIGuild>
  getMembersCache(guild: string): CacheCell<string, APIGuildMember>
  getUsersCache(): CacheCell<string, APIUser>
  getPresencesCache(): CacheCell<string, GatewayActivity>
  getMessagesCache(channel: string): CacheCell<string, APIMessage>
}
