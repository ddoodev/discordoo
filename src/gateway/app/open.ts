import { WebSocketClient } from '../../../src/gateway/WebSocketClient'
import WebSocket from 'ws'
import { WebSocketClientEvents, WebSocketClientStates } from '../../../src/constants'

// handles websocket open event
export function open(app: WebSocketClient, event: WebSocket.OpenEvent) {
  app.status = WebSocketClientStates.Connected
  app.emit(WebSocketClientEvents.WsOpen, event)
}
