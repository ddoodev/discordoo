import { CacheCell, CacheModule as ICacheModule } from '@discordoo/core'
import CollectionCacheCell from './CollectionCacheCell'
import { Collection } from '@discordoo/collection'
import {
  APIChannel,
  APIEmoji,
  APIGuild,
  APIGuildMember,
  APIMessage,
  APIUser,
  GatewayActivity
} from 'discord-api-types'

export default class CacheModule implements ICacheModule {
  isCore = true
  type: 'cache' | 'gateway' | 'rest' = 'cache'
  id = 'discordoo.modules.cache'
  private _caches: Collection<string, CollectionCacheCell<any, any>> =
    new Collection<string, CollectionCacheCell<any, any>>()

  constructor() { // TODO: add here cache policies

  }

  createCache<K extends CacheCell<any, any>>(type: string): K {
    this._caches.set(type, new CollectionCacheCell<any, any>(type) as unknown as K)
    return this._caches.get(type) as unknown as K
  }

  getCache<K>(type: string): K | undefined {
    return this._caches.get(type) as unknown as K
  }
  
  getChannelsCache(guild?: string): CollectionCacheCell<string, APIChannel> {
    if (guild) {
      return this.getCache<CollectionCacheCell<string, APIChannel>>(`channels:${guild}`) 
        ?? this.createCache<CollectionCacheCell<string, APIChannel>>(`channels:${guild}`)
    } else {
      return this.getCache<CollectionCacheCell<string, APIChannel>>('channels')
        ?? this.createCache<CollectionCacheCell<string, APIChannel>>('channels')
    }
  }

  getGuildsCache(): CollectionCacheCell<string, APIGuild> {
    return this.getCache<CollectionCacheCell<string, APIGuild>>('guilds')
      ?? this.createCache<CollectionCacheCell<string, APIGuild>>('guilds')
  }

  getGuildEmojisCache(guild: string): CollectionCacheCell<string, APIEmoji> {
    return this.getCache<CollectionCacheCell<string, APIEmoji>>(`emojis:${guild}`)
      ?? this.createCache<CollectionCacheCell<string, APIEmoji>>(`emojis:${guild}`)
  }

  getMembersCache(guild: string): CollectionCacheCell<string, APIGuildMember> {
    return this.getCache<CollectionCacheCell<string, APIGuildMember>>(`members:${guild}`)
      ?? this.createCache<CollectionCacheCell<string, APIGuildMember>>(`members:${guild}`)
  }

  getMessagesCache(channel: string): CollectionCacheCell<string, APIMessage> {
    return this.getCache<CollectionCacheCell<string, APIMessage>>(`messages:${channel}`)
      ?? this.createCache<CollectionCacheCell<string, APIMessage>>(`messages:${channel}`)
  }

  getPresencesCache(): CollectionCacheCell<string, GatewayActivity> {
    return this.getCache<CollectionCacheCell<string, GatewayActivity>>('presences')
      ?? this.createCache<CollectionCacheCell<string, GatewayActivity>>('presences')
  }

  getUsersCache(): CollectionCacheCell<string, APIUser> {
    return this.getCache<CollectionCacheCell<string, APIUser>>('users')
      ?? this.createCache<CollectionCacheCell<string, APIUser>>('users')
  }
}