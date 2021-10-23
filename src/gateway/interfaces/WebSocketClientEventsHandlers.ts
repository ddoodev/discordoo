import WebSocket from 'ws'
import { GatewaySendPayloadLike } from '@discordoo/providers'

export interface WebSocketClientEventsHandlers {
  WS_SEND_ERROR: (error: Error, data: GatewaySendPayloadLike) => unknown
  WS_OPEN_ERROR: (error: Error) => unknown
  WS_CLOSE_ERROR: (error: Error) => unknown

  WS_ERROR: (error: WebSocket.ErrorEvent) => unknown
  WS_OPEN: (event: WebSocket.OpenEvent) => unknown
  WS_CLOSED: (code: WebSocket.CloseEvent) => unknown

  __RECONNECT_ME__: (destroyed?: boolean) => unknown

  ready: () => unknown
  resumed: () => unknown
  destroyed: () => unknown
  invalidSession: () => unknown
}
