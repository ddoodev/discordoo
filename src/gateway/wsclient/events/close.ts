import WebSocketClient from '@src/gateway/WebSocketClient'
import WebSocket from 'ws'
import { WebSocketClientEvents, WebSocketClientStates } from '@src/core/Constants'

// handles websocket close event
export default function close(client: WebSocketClient, event: WebSocket.CloseEvent) {
  client.status = WebSocketClientStates.DISCONNECTED
  client.emit(WebSocketClientEvents.WS_CLOSED, event)
  if (event.code !== 4901 && event.code !== 1000) client.destroy({ reconnect: true, code: event.code })
}
