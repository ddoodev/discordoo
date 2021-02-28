import { Shard } from '@discordoo/core'
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
import ProtocolMessage from './protocol/ProtocolMessage'
import { CacheCell } from '@discordoo/core'

/**
 * WebSocket shard
 *
 * In fact, it serves as an IPC gateway to actual shard process
 */
export default class WSShard implements Shard {
  id: number
  manager: WebSocketManager
  token: string
  worker: Worker

  constructor(manager: WebSocketManager, id: number, worker: Worker, token?: string) {
    this.id = id
    this.manager = manager
    this.token = token ?? this.manager.module.token!
    this.worker = worker
  }

  connect(): Promise<void> | void {
    this.worker.on('message', console.log)
    return undefined
  }

  sendProtocolMessage(message: ProtocolMessage) {
    this.worker.postMessage(JSON.stringify(message))
  }

  // @ts-ignore
  getChannelsCache(guild?: string): CacheCell<string, APIChannel> {
    // @ts-ignore
    return undefined
  }

  // @ts-ignore
  getGuildEmojisCache(guild: string): CacheCell<string, APIEmoji> {
    // @ts-ignore
    return undefined
  }

  // @ts-ignore
  getGuildsCache(): CacheCell<string, APIGuild> {
    // @ts-ignore
    return undefined
  }

  // @ts-ignore
  getMembersCache(guild: string): CacheCell<string, APIGuildMember> {
    // @ts-ignore
    return undefined
  }

  // @ts-ignore
  getMessagesCache(channel: string): CacheCell<string, APIMessage> {
    // @ts-ignore
    return undefined
  }

  // @ts-ignore
  getPresencesCache(): CacheCell<string, GatewayActivity> {
    // @ts-ignore
    return undefined
  }

  // @ts-ignore
  getUsersCache(): CacheCell<string, APIUser> {
    // @ts-ignore
    return undefined
  }
}
