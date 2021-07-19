import { IpcEvents, IpcOpCodes } from '@src/core/Constants'

export interface IpcPacket {
  op: IpcOpCodes
  d: any
  t?: IpcEvents
}
