import { WebSocketOpCodes, WebSocketDispatchEvents } from '@src/constants'

export interface WebSocketPacket {
  op: WebSocketOpCodes
  d: any
  s: number | undefined
  t: WebSocketDispatchEvents
}
