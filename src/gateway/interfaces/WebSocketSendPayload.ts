import { GatewaySendPayload } from 'discord-api-types'
import { OPCodes } from '@src/core/Constants'

type WebSocketSendPayload =
  GatewaySendPayload
  | { op: OPCodes }
  | { op: OPCodes; d: any }

export default WebSocketSendPayload
