import { IpcPacket } from '@src/sharding'
import { IpcCacheOpCodes, IpcEvents, IpcOpCodes } from '@src/constants'

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

export interface IpcCacheGetOperationRequestPacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    op: IpcCacheOpCodes.GET
    key: any
    keyspace: string
    shards: number[]
    serialize: boolean
  }
}

export interface IpcCacheGetOperationResponsePacket extends IpcPacket {
  op: IpcOpCodes.CACHE_OPERATE
  d: {
    event_id: string
    result: any
    success: boolean
  }
}
