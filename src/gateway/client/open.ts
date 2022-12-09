import { WebSocketClient } from '@src/gateway/WebSocketClient'
import WebSocket from 'ws'
import { WebSocketClientEvents, WebSocketClientStates } from '@src/constants'

// handles websocket open event
export function open(client: WebSocketClient, event: WebSocket.OpenEvent) {
  client.status = WebSocketClientStates.Connected
  client.emit(WebSocketClientEvents.WsOpen, event)
}
