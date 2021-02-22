import { Shard } from '@discordoo/core'
import WebSocket from 'ws'
import WebSocketManager from './WebSocketManager'
import {
  APIChannel,
  APIEmoji,
  APIGuild,
  APIGuildMember,
  APIMessage,
  APIUser,
  GatewayActivity
} from 'discord-api-types'

export default class WSShard implements Shard<WebSocket> {
  connection?: WebSocket
  id: number
  manager: WebSocketManager
  token: string

  constructor(manager: WebSocketManager, id: number, token?: string) {
    this.id = id
    this.manager = manager
    this.token = token ?? this.manager.module.config.token
  }

  connect(): Promise<void> | void {
    return undefined
  }

  getChannelsCache(guild?: string): CacheCell<string, APIChannel> {
    return undefined
  }

  getGuildEmojisCache(guild: string): CacheCell<string, APIEmoji> {
    return undefined
  }

  getGuildsCache(): CacheCell<string, APIGuild> {
    return undefined
  }

  getMembersCache(guild: string): CacheCell<string, APIGuildMember> {
    return undefined
  }

  getMessagesCache(channel: string): CacheCell<string, APIMessage> {
    return undefined
  }

  getPresencesCache(): CacheCell<string, GatewayActivity> {
    return undefined
  }

  getUsersCache(): CacheCell<string, APIUser> {
    return undefined
  }
}
