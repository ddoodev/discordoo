import { IpcEvents, IpcOPCodes } from '@src/core/Constants'

export interface IpcPacket {
  op: IpcOPCodes
  d: any
  t?: IpcEvents
}
