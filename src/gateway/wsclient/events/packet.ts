import { WebSocketUtils } from '@src/utils/WebSocketUtils'
import { WebSocketClient } from '@src/gateway/WebSocketClient'
import { WebSocketClientEvents, WebSocketClientStates, WebSocketOpCodes } from '@src/constants'
import { WebSocketPacket } from '@src/gateway/interfaces/WebSocketPacket'
import { wait } from '@src/utils/wait'

export function packet(
  client: WebSocketClient,
  // it should have been GatewayDispatchPayload & GatewayReceivePayload, but IntelliJ says SYS LOAD 666%
  // https://cdn.discordapp.com/attachments/531549268033404928/850888918811017256/2021-06-05_22-44-36.mp4
  // so a warning to anyone who reads this: do not use GatewayDispatchPayload & GatewayReceivePayload type
  packet: WebSocketPacket
) {

  // console.log('shard', client.id, 'packet', packet)

  // process sequence increase
  if (WebSocketUtils.exists(packet.s) && packet.s! > client.sequence) client.sequence = packet.s!

  console.log('shard', client.id, 'SEQUENCE', client.sequence)

  /**
   * ready and resumed events handling
   * this is necessary to resolve promise returned from WebSocketClient.connect()
   * and also to set the expected servers, sessionID and to tell discord that we are alive
   * */
  switch (packet.t) {
    case 'READY':

      client.sessionID = packet.d.session_id
      client.status = WebSocketClientStates.READY
      client.expectedGuilds = new Set<any>(packet.d.guilds.map(g => g.id))

      client.heartbeat()

      client.emit(WebSocketClientEvents.READY)
      console.log('shard', client.id, 'READY')
      break
    case 'RESUMED':
      client.status = WebSocketClientStates.READY
      client.emit(WebSocketClientEvents.RESUMED)
      console.log('shard', client.id, 'RESUMED and replayed', client.sequence - client.closeSequence, 'events')
      break
  }

  switch (packet.op) {
    case WebSocketOpCodes.HELLO:

      client.heartbeatInterval(packet.d.heartbeat_interval)
      client.handshakeTimeout()
      client.identify()
      console.log('shard', client.id, 'HELLO')

      break

    case WebSocketOpCodes.INVALID_SESSION:
      client.emit(WebSocketClientEvents.INVALID_SESSION)

      wait(5000).then(() => {
        client.destroy({ code: 1000, reconnect: true })
      })
      console.log('shard', client.id, 'INVALID SESSION')

      break

    case WebSocketOpCodes.HEARTBEAT:
      client.heartbeat()
      break

    case WebSocketOpCodes.HEARTBEAT_ACK:
      console.log('shard', client.id, 'HEARTBEAT_ACK')
      client.missedHeartbeats -= 1
      client.ping = Date.now() - client.lastPingTimestamp
      break

    case WebSocketOpCodes.RECONNECT:
      client.destroy({ reconnect: true })
      break

    case WebSocketOpCodes.DISPATCH:

      break
  }
}
