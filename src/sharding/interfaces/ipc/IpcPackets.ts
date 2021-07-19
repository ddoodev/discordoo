import { IpcPacket } from '@src/sharding'
import { IpcEvents, IpcOpCodes } from '@src/core/Constants'

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
