import { WebSocketClient } from '@src/gateway/WebSocketClient'
import { IdentifyOptions } from '@src/gateway/interfaces/IdentifyOptions'
import { WebSocketClientStates } from '@src/constants'
import { GatewayOpCodes } from '@discordoo/providers'

// creates discord api identify payload
export function identify(
  client: WebSocketClient,
  options: IdentifyOptions
): any { // TODO: return type

  const mode =
    (client.sessionId && client.closeSequence > 0) && (!options.useReconnectOnly || options.forceResume)
    ? 'resume'
    : 'identify'
  const { token } = options

  // console.log('shard', client.id, mode)

  let d: any, // TODO: return type
    op: GatewayOpCodes.IDENTIFY | GatewayOpCodes.RESUME

  switch (mode) {
    case 'identify': {
      const { intents, properties, presence, compress } = options

      client.status = WebSocketClientStates.IDENTIFYING
      op = GatewayOpCodes.IDENTIFY

      d = {
        token,
        intents,
        properties,
        presence: presence || undefined,
        compress,
        shard: [ client.id, client.manager.options.totalShards ]
      }
    } break

    case 'resume': {
      client.status = WebSocketClientStates.RESUMING
      op = GatewayOpCodes.RESUME

      d = {
        token,
        session_id: client.sessionId!,
        seq: client.closeSequence
      }
    } break
  }

  return {
    d, op
  } as unknown as any // TODO
}
