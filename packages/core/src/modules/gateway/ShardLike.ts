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

export default interface ShardLike {
  getChannelsCache(guild?: string): CacheCell<string, APIChannel>
  getGuildEmojisCache(guild: string): CacheCell<string, APIEmoji>
  getGuildsCache(): CacheCell<string, APIGuild>
  getMembersCache(guild: string): CacheCell<string, APIGuildMember>
  getUsersCache(): CacheCell<string, APIUser>
  getPresencesCache(): CacheCell<string, GatewayActivity>
  getMessagesCache(channel: string): CacheCell<string, APIMessage>
}
