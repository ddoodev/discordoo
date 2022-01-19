import { IpcEvents, IpcOpCodes } from '@src/constants'

export interface IpcPacket {
  op: IpcOpCodes
  d?: any
  t?: IpcEvents
}
