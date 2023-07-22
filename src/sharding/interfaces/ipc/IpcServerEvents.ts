import { IpcPacket } from '../../../../src/sharding'

export interface IpcServerEvents {
  RAW: (packet: IpcPacket) => unknown
}
