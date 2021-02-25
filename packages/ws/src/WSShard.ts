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
import { Worker } from 'worker_threads'

/**
 * WebSocket shard
 *
 * In fact, it serves as an IPC gateway to actual shard process
 */
export default class WSShard implements Shard<WebSocket> {
  connection?: WebSocket
  id: number
  manager: WebSocketManager
  token: string
  worker: Worker

  constructor(manager: WebSocketManager, id: number, worker: Worker, token?: string) {
    this.id = id
    this.manager = manager
    this.token = token ?? this.manager.module.token
    this.worker = worker
  }

  connect(): Promise<void> | void {
    this.worker.on('message', console.log)
    return undefined
  }

  // @ts-ignore
  getChannelsCache(guild?: string): CacheCell<string, APIChannel> {
    return undefined
  }

  // @ts-ignore
  getGuildEmojisCache(guild: string): CacheCell<string, APIEmoji> {
    return undefined
  }

  // @ts-ignore
  getGuildsCache(): CacheCell<string, APIGuild> {
    return undefined
  }

  // @ts-ignore
  getMembersCache(guild: string): CacheCell<string, APIGuildMember> {
    return undefined
  }

  // @ts-ignore
  getMessagesCache(channel: string): CacheCell<string, APIMessage> {
    return undefined
  }

  // @ts-ignore
  getPresencesCache(): CacheCell<string, GatewayActivity> {
    return undefined
  }

  // @ts-ignore
  getUsersCache(): CacheCell<string, APIUser> {
    return undefined
  }
}
