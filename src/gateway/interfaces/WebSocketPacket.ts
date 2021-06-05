import { OPCodes } from '@src/core/Constants'
import { GatewayDispatchEvents } from 'discord-api-types'

export default interface WebSocketPacket {
  op: OPCodes
  d: any
  s: number | undefined
  t: GatewayDispatchEvents
}
