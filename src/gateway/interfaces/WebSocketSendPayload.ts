import { GatewaySendPayload } from 'discord-api-types'
import { WebSocketOpCodes } from '@src/core/Constants'

export type WebSocketSendPayload =
  GatewaySendPayload
  | { op: WebSocketOpCodes }
  | { op: WebSocketOpCodes; d: any }
