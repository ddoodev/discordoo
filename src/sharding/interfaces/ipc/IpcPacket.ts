import { IpcEvents, IpcOPCodes } from '@src/core/Constants'

export default interface IpcPacket {
  op: IpcOPCodes
  d: any
  t?: IpcEvents
}
