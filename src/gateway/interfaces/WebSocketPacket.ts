import { WebSocketDispatchEvents } from '../../../src/constants'
import { GatewayOpCodes } from '../../../../providers/src/_index'

export interface WebSocketPacket {
  op: GatewayOpCodes
  d: any
  s: number | undefined
  t: WebSocketDispatchEvents
}
