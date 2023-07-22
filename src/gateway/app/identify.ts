import { WebSocketClient } from '../../../src/gateway/WebSocketClient'
import { WebSocketClientStates } from '../../../src/constants'
import { GatewayOpCodes } from '../../../../providers/src/_index'
import { CompletedGatewayOptions } from '../../../src/gateway/interfaces/GatewayOptions'

// creates discord api identify payload
export function identify(
  app: WebSocketClient,
  options: CompletedGatewayOptions
): any { // TODO: return type

  const mode = (app.sessionId && app.closeSequence > 0) ? 'resume' : 'identify'
  const { token } = options

  // console.log('shard', app.id, mode)

  let d: any, // TODO: return type
    op: GatewayOpCodes.IDENTIFY | GatewayOpCodes.RESUME

  switch (mode) {
    case 'identify': {
      const { intents, presence } = options,
        { properties, compress } = options.connection

      app.status = WebSocketClientStates.Identifying
      op = GatewayOpCodes.IDENTIFY

      d = {
        token,
        intents,
        properties,
        presence: presence || undefined,
        compress,
        shard: [ app.id, app.manager.options.sharding.totalShards ]
      }
    } break

    case 'resume': {
      app.status = WebSocketClientStates.Resuming
      op = GatewayOpCodes.RESUME

      d = {
        token,
        session_id: app.sessionId!,
        seq: app.closeSequence
      }
    } break
  }

  return {
    d, op
  } as any // TODO
}
