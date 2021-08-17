import { IpcPacket } from '@src/sharding'
import { IpcCacheOpCodes, IpcEvents, IpcOpCodes, SerializeModes } from '@src/constants'
import { CacheStorageKey } from '@src/cache/interfaces/CacheStorageKey'
import { EntityKey } from '@src/entities'

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

export interface IpcHeartbeatPacket extends IpcPacket {
  op: IpcOpCodes.HEARTBEAT
  d: {
    id: string
    event_id: string
  }
}

export interface IpcDispatchPacket extends IpcPacket {
  op: IpcOpCodes.DISPATCH
  d: any
  t: IpcEvents
}

export interface IpcCacheGetRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.GET
    serialize?: SerializeModes.ANY
    shards: number[]
    key: any
    keyspace: string
    storage: CacheStorageKey
    entityKey: EntityKey
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
    serialize?: SerializeModes.BOOLEAN
    shards: number[]
    key: any
    keyspace: string
    storage: CacheStorageKey
    entityKey: EntityKey
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
    serialize?: SerializeModes.BOOLEAN
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
    entityKey: EntityKey
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
    serialize?: SerializeModes.NUMBER
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
    serialize?: SerializeModes.BOOLEAN
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
    entityKey: EntityKey
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
    serialize?: SerializeModes.ARRAY
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entityKey: EntityKey
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
    serialize?: SerializeModes.ARRAY
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entityKey: EntityKey
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
    serialize?: SerializeModes.ANY
    shards: number[]
    keyspace: string
    storage: CacheStorageKey
    entityKey: EntityKey
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
