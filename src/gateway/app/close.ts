import { WebSocketClient } from '../../../src/gateway/WebSocketClient'
import WebSocket from 'ws'
import { WebSocketClientEvents, WebSocketClientStates } from '../../../src/constants'

// handles websocket close event
export function close(app: WebSocketClient, event: WebSocket.CloseEvent) {
  app.status = WebSocketClientStates.Disconnected
  app.emit(WebSocketClientEvents.WsClosed, event)
  if (!event.reason?.includes('ddoo')) app.destroy({ reconnect: true, code: event.code })
}
