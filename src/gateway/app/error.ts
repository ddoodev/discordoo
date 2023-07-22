import { WebSocketClient } from '@src/gateway/WebSocketClient'
import WebSocket from 'ws'
import { WebSocketClientEvents } from '@src/constants'

// handles websocket error event
export function error(app: WebSocketClient, event: WebSocket.ErrorEvent) {
  app.emit(WebSocketClientEvents.WsError, event)
}
