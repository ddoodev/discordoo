import { WebSocketOpCodes } from '@src/constants'

export type WebSocketSendPayload =
  | { op: WebSocketOpCodes }
  | { op: WebSocketOpCodes; d: any }
