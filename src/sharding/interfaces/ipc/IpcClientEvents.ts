import { IpcPacket } from '../../../../src/sharding'

export interface IpcClientEvents {
  RAW: (packet: IpcPacket) => unknown
}
