import { WebSocketClient } from '@src/gateway/WebSocketClient'
import { IdentifyOptions } from '@src/gateway/interfaces/IdentifyOptions'
import { WebSocketClientStates, WebSocketOPCodes } from '@src/core/Constants'
import { GatewayIdentify, GatewayIdentifyData, GatewayResume, GatewayResumeData } from 'discord-api-types'

// creates discord api identify payload
export function identify(
  client: WebSocketClient,
  options: IdentifyOptions
): GatewayIdentify | GatewayResume {

  const mode =
    (client.sessionID && client.closeSequence > 0) && (!options.useReconnectOnly || options.forceResume)
    ? 'resume'
    : 'identify'
  const { token } = options

  console.log('shard', client.id, mode)

  let d: GatewayIdentifyData | GatewayResumeData,
    op: WebSocketOPCodes.IDENTIFY | WebSocketOPCodes.RESUME

  switch (mode) {
    case 'identify': {
      const { intents, properties, presence, compress } = options

      client.status = WebSocketClientStates.IDENTIFYING
      op = WebSocketOPCodes.IDENTIFY

      d = {
        token,
        intents,
        properties,
        presence: presence || undefined,
        compress,
        shard: [ client.id, client.manager.totalShards ]
      }
    } break

    case 'resume': {
      client.status = WebSocketClientStates.RESUMING
      op = WebSocketOPCodes.RESUME

      d = {
        token,
        session_id: client.sessionID!,
        seq: client.closeSequence
      }
    } break
  }

  return {
    d, op
  } as unknown as GatewayIdentify | GatewayResume
}
