import WebSocketClient from '@src/gateway/WebSocketClient'
import WebSocket from 'ws'
import { WebSocketClientEvents } from '@src/core/Constants'

// handles websocket error event
export default function error(client: WebSocketClient, event: WebSocket.ErrorEvent) {
  client.emit(WebSocketClientEvents.WS_ERROR, event)
}
