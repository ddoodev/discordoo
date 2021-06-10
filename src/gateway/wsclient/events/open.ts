import WebSocketClient from '@src/gateway/WebSocketClient'
import WebSocket from 'ws'
import { WebSocketClientEvents, WebSocketClientStates } from '@src/core/Constants'

// handles websocket open event
export default function open(client: WebSocketClient, event: WebSocket.OpenEvent) {
  client.status = WebSocketClientStates.CONNECTED
  client.emit(WebSocketClientEvents.WS_OPEN, event)
}
