import { GatewaySendPayload } from 'discord-api-types'
import { WebSocketOpCodes } from '@src/constants'

export type WebSocketSendPayload =
  GatewaySendPayload
  | { op: WebSocketOpCodes }
  | { op: WebSocketOpCodes; d: any }
