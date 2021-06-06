import WebSocketUtils from '@src/util/WebSocketUtils'
import WebSocketClient from '@src/gateway/WebSocketClient'
import { OPCodes, WebSocketClientEvents, WebSocketClientStates } from '@src/core/Constants'
import WebSocketPacket from '@src/gateway/interfaces/WebSocketPacket'
import wait from '@src/util/wait'

export default async function packet(
  client: WebSocketClient,
  // it should have been GatewayDispatchPayload & GatewayReceivePayload, but IntelliJ says SYS LOAD 666%
  // https://cdn.discordapp.com/attachments/531549268033404928/850888918811017256/2021-06-05_22-44-36.mp4
  // so a warning to anyone who reads this: do not use GatewayDispatchPayload & GatewayReceivePayload type
  packet: WebSocketPacket,
  functions: { // TODO: rewrite this
    identify: WebSocketClient['identify']
    heartbeat: WebSocketClient['heartbeat']
    destroy: WebSocketClient['destroy']
    setHeartbeatInterval: WebSocketClient['setHeartbeatInterval']
  }
) {

  console.log('shard', client.id, 'packet', packet)

  Object.keys(functions).forEach(key => functions[key] = functions[key].bind(client))

  const { identify, heartbeat, destroy, setHeartbeatInterval } = functions

  // process sequence increase
  if (WebSocketUtils.exists(packet.s) && packet.s! > client.sequence) client.sequence = packet.s!

  /**
   * process ready and resumed events
   * this is necessary to resolve promise returned from WebSocketClient.connect()
   * and also to set the expected servers, sessionID and to tell discord that we are alive
   * */
  switch (packet.t) {
    case 'READY':

      client.sessionID = packet.d.session_id
      client.status = WebSocketClientStates.READY
      client.expectedGuilds = new Set<any>(packet.d.guilds.map(g => g.id))

      heartbeat()

      client.emit('ready')
      break
    case 'RESUMED':
      client.status = WebSocketClientStates.READY
      client.emit(WebSocketClientEvents.RESUMED)
      break
  }

  switch (packet.op) {
    case OPCodes.HELLO:

      setHeartbeatInterval(packet.d.heartbeat_interval)
      identify()

      break

    case OPCodes.INVALID_SESSION:
      client.emit('invalidSession')

      await wait(5000)
      destroy({ code: 4000 })

      break

    case OPCodes.HEARTBEAT:
      heartbeat()
      break

    case OPCodes.HEARTBEAT_ACK:
      client.missedHeartbeats -= 1
      client.ping = Date.now() - client.lastPingTimestamp
      break
  }
}
