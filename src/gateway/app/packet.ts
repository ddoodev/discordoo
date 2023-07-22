import { WebSocketUtils } from '../../../src/utils/WebSocketUtils'
import { WebSocketClient } from '../../../src/gateway/WebSocketClient'
import { WebSocketClientEvents, WebSocketClientStates } from '../../../src/constants'
import { GatewayOpCodes } from '../../../../providers/src/_index'
import { WebSocketPacket } from '../../../src/gateway/interfaces/WebSocketPacket'
import { makeConnectionUrl } from '../../../src/gateway/makeConnectionUrl'

export function packet(app: WebSocketClient, packet: WebSocketPacket) {

  // console.log('shard', app.id, 'packet', packet)

  // process sequence increase
  if (WebSocketUtils.exists<number>(packet.s) && packet.s > app.sequence) app.sequence = packet.s

  // console.log('shard', app.id, 'SEQUENCE', app.sequence)

  /**
   * ready and resumed events handling
   * this is necessary to resolve promise returned from WebSocketClient.connect()
   * and also to set the expected servers, sessionId and to tell discord that we are alive
   * */
  switch (packet.t) {
    case 'READY':

      app.sessionId = packet.d.session_id
      app.status = WebSocketClientStates.Ready
      app.expectedGuilds = new Set<any>(packet.d.guilds.map(g => g.id))
      app.resumeUrl = makeConnectionUrl(app.options.connection, packet.d.resume_gateway_url)

      app.heartbeat()

      app.emit(WebSocketClientEvents.Ready)
      app.manager.provider.emit(app.id, { op: GatewayOpCodes.DISPATCH, t: WebSocketClientEvents.Connected, d: packet.d })
      // console.log('shard', app.id, 'Ready')
      break
    case 'RESUMED':
      app.status = WebSocketClientStates.Ready
      app.emit(WebSocketClientEvents.Resumed)
      // console.log('shard', app.id, 'RESUMED and replayed', app.sequence - app.closeSequence, 'events')
      break
  }

  switch (packet.op) {
    case GatewayOpCodes.HELLO:

      app.heartbeatInterval(packet.d.heartbeat_interval)
      app.handshakeTimeout()
      app.identify()
      // console.log('shard', app.id, 'HELLO')

      break

    case GatewayOpCodes.INVALID_SESSION:
      app.emit(WebSocketClientEvents.InvalidSession)
      // console.log('SHARD', app.id, 'INVALID SESSION')
      app.sessionId = undefined

      // invalid session handled automatically: app.destroy({ code: 1000, reconnect: true })
      // console.log('shard', app.id, 'INVALID SESSION')

      break

    case GatewayOpCodes.HEARTBEAT:
      app.heartbeat()
      break

    case GatewayOpCodes.HEARTBEAT_ACK:
      // console.log('shard', app.id, 'HEARTBEAT_ACK')
      app.missedHeartbeats = 0
      app.ping = Date.now() - app.lastPingTimestamp
      break

    case GatewayOpCodes.RECONNECT:
      app.destroy({ reconnect: true })
      break

    case GatewayOpCodes.DISPATCH:
      app.manager.provider.emit(app.id, packet)
      break
  }
}
