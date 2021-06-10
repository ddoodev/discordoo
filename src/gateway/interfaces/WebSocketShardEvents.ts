/**
 * !!! WARNING !!!
 *
 * DEPRECATED. no longer used.
 * */

import { GatewayDispatchEvents } from 'discord-api-types'

export default interface WebSocketShardEvents {
  dispatch: (msg: GatewayDispatchEvents) => unknown
  invalidated: () => unknown
  connected: () => unknown
  ready: () => unknown
  closed: () => unknown
}
