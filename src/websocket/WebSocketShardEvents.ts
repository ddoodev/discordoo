import { GatewayDispatchEvents } from 'discord-api-types'

export default interface WebSocketShardEvents {
  message: (msg: GatewayDispatchEvents) => unknown
}
