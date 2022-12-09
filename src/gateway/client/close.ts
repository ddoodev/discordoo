import { WebSocketClient } from '@src/gateway/WebSocketClient'
import WebSocket from 'ws'
import { WebSocketClientEvents, WebSocketClientStates } from '@src/constants'

// handles websocket close event
export function close(client: WebSocketClient, event: WebSocket.CloseEvent) {
  client.status = WebSocketClientStates.Disconnected
  client.emit(WebSocketClientEvents.WsClosed, event)
  if (!event.reason?.includes('ddoo')) client.destroy({ reconnect: true, code: event.code })
}
