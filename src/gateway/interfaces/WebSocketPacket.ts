import { WebSocketOpCodes } from '@src/constants'
import { GatewayDispatchEvents } from 'discord-api-types'

export interface WebSocketPacket {
  op: WebSocketOpCodes
  d: any
  s: number | undefined
  t: GatewayDispatchEvents
}
