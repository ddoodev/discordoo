import { GatewaySendPayload } from 'discord-api-types'
import { WebSocketOPCodes } from '@src/core/Constants'

export type WebSocketSendPayload =
  GatewaySendPayload
  | { op: WebSocketOPCodes }
  | { op: WebSocketOPCodes; d: any }
