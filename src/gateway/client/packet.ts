import { WebSocketUtils } from '@src/utils/WebSocketUtils'
import { WebSocketClient } from '@src/gateway/WebSocketClient'
import { WebSocketClientEvents, WebSocketClientStates } from '@src/constants'
import { GatewayOpCodes } from '@discordoo/providers'
import { WebSocketPacket } from '@src/gateway/interfaces/WebSocketPacket'

export function packet(client: WebSocketClient, packet: WebSocketPacket) {

  // console.log('shard', client.id, 'packet', packet)

  // process sequence increase
  if (WebSocketUtils.exists<number>(packet.s) && packet.s > client.sequence) client.sequence = packet.s

  // console.log('shard', client.id, 'SEQUENCE', client.sequence)

  /**
   * ready and resumed events handling
   * this is necessary to resolve promise returned from WebSocketClient.connect()
   * and also to set the expected servers, sessionId and to tell discord that we are alive
   * */
  switch (packet.t) {
    case 'READY':

      client.sessionId = packet.d.session_id
      client.status = WebSocketClientStates.READY
      client.expectedGuilds = new Set<any>(packet.d.guilds.map(g => g.id))

      client.heartbeat()

      client.emit(WebSocketClientEvents.READY)
      client.manager.provider.emit(client.id, WebSocketClientEvents.CONNECTED, packet.d)
      // console.log('shard', client.id, 'READY')
      break
    case 'RESUMED':
      client.status = WebSocketClientStates.READY
      client.emit(WebSocketClientEvents.RESUMED)
      // console.log('shard', client.id, 'RESUMED and replayed', client.sequence - client.closeSequence, 'events')
      break
  }

  switch (packet.op) {
    case GatewayOpCodes.HELLO:

      client.heartbeatInterval(packet.d.heartbeat_interval)
      client.handshakeTimeout()
      client.identify()
      // console.log('shard', client.id, 'HELLO')

      break

    case GatewayOpCodes.INVALID_SESSION:
      client.emit(WebSocketClientEvents.INVALID_SESSION)
      // console.log('SHARD', client.id, 'INVALID SESSION')

      // client.destroy({ code: 1000, reconnect: true })
      // console.log('shard', client.id, 'INVALID SESSION')

      break

    case GatewayOpCodes.HEARTBEAT:
      client.heartbeat()
      break

    case GatewayOpCodes.HEARTBEAT_ACK:
      // console.log('shard', client.id, 'HEARTBEAT_ACK')
      client.missedHeartbeats = 0
      client.ping = Date.now() - client.lastPingTimestamp
      break

    case GatewayOpCodes.RECONNECT:
      client.destroy({ reconnect: true })
      break

    case GatewayOpCodes.DISPATCH:
      client.manager.provider.emit(client.id, packet.t, packet.d)
      break
  }
}
