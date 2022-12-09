import WebSocket from 'ws'
import { GatewaySendPayloadLike } from '@discordoo/providers'

export interface WebSocketClientEventsHandlers {
  WsSendError: (error: Error, data: GatewaySendPayloadLike) => unknown
  WsOpenError: (error: Error) => unknown
  WsCloseError: (error: Error) => unknown

  WsError: (error: WebSocket.ErrorEvent) => unknown
  WsOpen: (event: WebSocket.OpenEvent) => unknown
  WsClosed: (code: WebSocket.CloseEvent) => unknown

  __DDOO_RECONNECT_ME__: (destroyed?: boolean) => unknown

  ready: () => unknown
  resumed: () => unknown
  destroyed: () => unknown
  invalidSession: () => unknown
}
