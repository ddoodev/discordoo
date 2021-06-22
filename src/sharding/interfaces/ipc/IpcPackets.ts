import { IpcPacket } from '@src/sharding'
import { IpcEvents, IpcOPCodes } from '@src/core/Constants'

export interface IpcHelloPacket extends IpcPacket {
  op: IpcOPCodes.HELLO
  d: {
    id: string
    event_id: string
    shards: number[]
    total_shards: number
    heartbeat_interval: number
  }
}

export interface IpcIdentifyPacket extends IpcPacket {
  op: IpcOPCodes.IDENTIFY
  d: {
    id: string
    event_id: string
  }
}

export interface IpcHeartbeatPacket extends IpcPacket {
  op: IpcOPCodes.HEARTBEAT
  d: {
    id: string
    event_id: string
  }
}

export interface IpcDispatchPacket extends IpcPacket {
  op: IpcOPCodes.DISPATCH
  d: any
  t: IpcEvents
}
