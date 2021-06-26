import WebSocket from 'ws'
import { WebSocketSendPayload } from '@src/gateway/interfaces/WebSocketSendPayload'

export interface WebSocketClientEventsI {
  WS_SEND_ERROR: (error: Error, data: WebSocketSendPayload) => unknown
  WS_OPEN_ERROR: (error: Error) => unknown
  WS_CLOSE_ERROR: (error: Error) => unknown

  WS_ERROR: (error: WebSocket.ErrorEvent) => unknown
  WS_OPEN: (event: WebSocket.OpenEvent) => unknown
  WS_CLOSED: (code: WebSocket.CloseEvent) => unknown

  RECONNECT_ME: (destroyed?: boolean) => unknown

  ready: () => unknown
  resumed: () => unknown
  destroyed: () => unknown
  invalidSession: () => unknown
}
