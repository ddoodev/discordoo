import WebSocketClient from '@src/gateway/WebSocketClient'
import WebSocket from 'ws'
import { WebSocketClientEvents, WebSocketClientStates } from '@src/core/Constants'

export default function close(client: WebSocketClient, event: WebSocket.CloseEvent) {
  client.status = WebSocketClientStates.DISCONNECTED
  client.emit(WebSocketClientEvents.WS_CLOSED, event)
}
