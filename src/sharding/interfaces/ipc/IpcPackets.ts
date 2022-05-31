import { IpcPacket } from '@src/sharding'
import { IpcCacheOpCodes, IpcEvents, IpcOpCodes, SerializeModes } from '@src/constants'
import { CacheStorageKey } from '@discordoo/providers'
import { EntityKey } from '@src/api/entities/interfaces'
import { CacheOptions } from '@src/cache'
import { RawGuildMembersFetchOptions } from '@src/api/managers/members/RawGuildMembersFetchOptions'
import { GuildMemberData, PresenceUpdateData } from '@src/api'
import { IpcEmergencyOpCodes } from '@src/constants/sharding/IpcEmergencyOpCodes'

export interface IpcHelloPacket extends IpcPacket {
  op: IpcOpCodes.HELLO
  d: {
    id: string
    event_id: string
    shards: number[]
    total_shards: number
    heartbeat_interval: number
  }
}

export interface IpcIdentifyPacket extends IpcPacket {
  op: IpcOpCodes.IDENTIFY
  d: {
    id: string
    event_id: string
  }
}

export interface IpcEmergencyPacket extends IpcPacket {
  op: IpcOpCodes.EMERGENCY
  d: {
    op: IpcEmergencyOpCodes
  }
}

export interface IpcEmergencyRestBlockPacket extends IpcEmergencyPacket {
  d: {
    op: IpcEmergencyOpCodes.GLOBAL_RATE_LIMIT_ALMOST_REACHED
      | IpcEmergencyOpCodes.GLOBAL_RATE_LIMIT_HIT
      | IpcEmergencyOpCodes.INVALID_REQUEST_LIMIT_ALMOST_REACHED
      | IpcEmergencyOpCodes.INVALID_REQUEST_LIMIT_HIT
    block_until: number
  }
}

export interface IpcEmergencyGrlHitPacket extends IpcEmergencyPacket {
  d: {
    op: IpcEmergencyOpCodes.GLOBAL_RATE_LIMIT_HIT
    block_until: number
  }
}

export type IpcEmergencyPackets = IpcEmergencyRestBlockPacket

export interface IpcDispatchPacket extends IpcPacket {
  op: IpcOpCodes.DISPATCH
  t: IpcEvents
  d: any
}

// sends by sharding instance when some rest request was completed
export interface IpcRestLimitsSyncPacket extends IpcDispatchPacket {
  t: IpcEvents.REST_LIMITS_SYNC
  d: {
    success: boolean
  }
}

export interface IpcGuildMembersRequestPacket extends IpcDispatchPacket {
  t: IpcEvents.GUILD_MEMBERS_REQUEST
  d: RawGuildMembersFetchOptions & { event_id: string; shard_id: number }
}

export interface IpcGuildMembersResponsePacket extends IpcDispatchPacket {
  t: IpcEvents.GUILD_MEMBERS_REQUEST
  d: {
    event_id: string
    shard_id: number
    members: GuildMemberData[]
  }
}

export interface IpcBroadcastEvalRequestPacket extends IpcDispatchPacket {
  t: IpcEvents.BROADCAST_EVAL
  d: {
    event_id: string
    shards: number[]
    script: string
    context?: any
  }
}

export interface IpcBroadcastEvalResponsePacket extends IpcDispatchPacket {
  t: IpcEvents.BROADCAST_EVAL
  d: {
    event_id: string
    result: any[]
  }
}

export interface IpcBroadcastMessagePacket extends IpcDispatchPacket {
  t: IpcEvents.MESSAGE
  d: {
    event_id: string
    message: string
    shards: number[]
    from: number
  }
}

export interface IpcRestructuringRequestPacket extends IpcDispatchPacket {
  t: IpcEvents.RESTRUCTURING
  d: {
    event_id: string
    shards: number[]
    total_shards: number
  }
}

export interface IpcRestructuringResponsePacket extends IpcDispatchPacket {
  t: IpcEvents.RESTRUCTURING
  d: {
    event_id: string
  }
}

export interface IpcDestroyingPacket extends IpcDispatchPacket {
  t: IpcEvents.DESTROYING
  d: {
    event_id: string
  }
}

export interface IpcMessagePacket extends IpcDispatchPacket {
  t: IpcEvents.MESSAGE
  d: {
    event_id: string
    message: string
    from: number
  }
}

export interface IpcPresenceUpdatePacket extends IpcDispatchPacket {
  t: IpcEvents.PRESENCE_UPDATE
  d: {
    event_id: string
    presence: PresenceUpdateData
    shards: number[]
  }
}

export type IpcDispatchRequestPackets = IpcBroadcastEvalRequestPacket
  | IpcGuildMembersRequestPacket
  | IpcRestructuringRequestPacket

export type IpcDispatchResponsePackets = IpcBroadcastEvalResponsePacket
  | IpcGuildMembersResponsePacket
  | IpcRestructuringResponsePacket

export type IpcDispatchPackets = IpcBroadcastMessagePacket
  | IpcRestLimitsSyncPacket
  | IpcDispatchRequestPackets
  | IpcDispatchResponsePackets
  | IpcDestroyingPacket
  | IpcPresenceUpdatePacket

export interface IpcCacheGetRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.GET
    serialize: SerializeModes.ANY
    shards: number[]
    key: any
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
  }
}

export interface IpcCacheGetResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheSetRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.SET
    serialize: SerializeModes.BOOLEAN
    shards: number[]
    key: any
    keyspace: string
    storage: CacheStorageKey
    policy: keyof CacheOptions
    entity_key: EntityKey
    value: any
  }
}

export interface IpcCacheSetResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheDeleteRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.DELETE
    serialize: SerializeModes.BOOLEAN
    shards: number[]
    key: any
    keyspace: string
    storage: CacheStorageKey
  }
}

export interface IpcCacheDeleteResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheForEachRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.FOREACH
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
    script: string
  }
}

export interface IpcCacheForEachResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheSizeRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.SIZE
    serialize: SerializeModes.NUMBER
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
  }
}

export interface IpcCacheSizeResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheHasRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.HAS
    serialize: SerializeModes.BOOLEAN
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    key: any
  }
}

export interface IpcCacheHasResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheSweepRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.SWEEP
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
    script: string
  }
}

export interface IpcCacheSweepResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheFilterRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.FILTER
    serialize: SerializeModes.ARRAY
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
    script: string
  }
}

export interface IpcCacheFilterResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheMapRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.MAP
    serialize: SerializeModes.ARRAY
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
    script: string
  }
}

export interface IpcCacheMapResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheFindRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.FIND
    serialize: SerializeModes.ANY
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
    script: string
  }
}

export interface IpcCacheFindResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheClearRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.CLEAR
    serialize: SerializeModes.BOOLEAN
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
  }
}

export interface IpcCacheClearResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheCountRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.COUNT
    serialize: SerializeModes.NUMBER
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
    script: string
  }
}

export interface IpcCacheCountResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheCountsRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.COUNTS
    serialize: SerializeModes.NUMBERS_ARRAY
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
    scripts: string[]
  }
}

export interface IpcCacheCountsResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any
  }
}

export interface IpcCacheKeysRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.KEYS
    serialize: SerializeModes.ARRAY
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
  }
}

export interface IpcCacheKeysResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any[]
  }
}

export interface IpcCacheValuesRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.VALUES
    serialize: SerializeModes.ARRAY
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
  }
}

export interface IpcCacheValuesResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any[]
  }
}

export interface IpcCacheEntriesRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.ENTRIES
    serialize: SerializeModes.ARRAY
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entity_key: EntityKey
  }
}

export interface IpcCacheEntriesResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    success: boolean
    result: any[]
  }
}

export type IpcCacheRequestPacket = IpcCacheGetRequestPacket
  | IpcCacheSetRequestPacket
  | IpcCacheDeleteRequestPacket
  | IpcCacheForEachRequestPacket
  | IpcCacheSizeRequestPacket
  | IpcCacheHasRequestPacket
  | IpcCacheSweepRequestPacket
  | IpcCacheFilterRequestPacket
  | IpcCacheMapRequestPacket
  | IpcCacheFindRequestPacket
  | IpcCacheClearRequestPacket
  | IpcCacheCountRequestPacket
  | IpcCacheCountsRequestPacket
  | IpcCacheKeysRequestPacket
  | IpcCacheValuesRequestPacket
  | IpcCacheEntriesRequestPacket

export type IpcCacheResponsePacket = IpcCacheGetResponsePacket
  | IpcCacheSetResponsePacket
  | IpcCacheDeleteResponsePacket
  | IpcCacheForEachResponsePacket
  | IpcCacheSizeResponsePacket
  | IpcCacheHasResponsePacket
  | IpcCacheSweepResponsePacket
  | IpcCacheFilterResponsePacket
  | IpcCacheMapResponsePacket
  | IpcCacheFindResponsePacket
  | IpcCacheClearResponsePacket
  | IpcCacheCountResponsePacket
  | IpcCacheCountsResponsePacket
  | IpcCacheKeysResponsePacket
  | IpcCacheValuesResponsePacket
  | IpcCacheEntriesResponsePacket
