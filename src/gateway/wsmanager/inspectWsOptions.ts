import { GatewayOptions } from '@src/gateway'
import { getGateway, range } from '@src/utils'
import DiscordooError from '@src/utils/DiscordooError'
import WsOptionsInspectionResult from '@src/gateway/interfaces/WsOptionsInspectionResult'
import Optional from '@src/utils/Optional'
import WebSocketUtils from '@src/utils/WebSocketUtils'

export default async function inspectWsOptions(options: GatewayOptions): Promise<WsOptionsInspectionResult> {

  const result: Optional<WsOptionsInspectionResult, 'gateway' | 'url'> = {
    gateway: undefined,
    shardsToSpawn: [],
    shardsInTotal: 1,
    url: undefined
  }, source = 'WebSocketManager'

  result.gateway = await getGateway(options.token)
    .catch(e => {
      console.log(e)
      throw e.statusCode === 401 ?
        new DiscordooError(source, 'invalid token provided')
        : e
    })

  const { shards: recommendedShards, url: gatewayUrl, session_start_limit: sessionStartLimit } = result.gateway,
        { shards } = options

  switch (typeof shards) {
    case 'number':
      result.shardsInTotal = shards
      result.shardsToSpawn = range(shards)
      break

    case 'object':
      if (!Array.isArray(shards)) {
        throw new DiscordooError(
          source, 'invalid "shards" option: type of "shards" cannot be object'
        )
      } else {
        result.shardsInTotal = shards.length
        result.shardsToSpawn = shards
      }
      break

    case 'string':
      if (shards === 'auto') {
        result.shardsInTotal = recommendedShards
        result.shardsToSpawn = range(recommendedShards)
      } else if (!isNaN(parseInt(shards))) {
        result.shardsInTotal = parseInt(shards)
        result.shardsToSpawn = range(parseInt(shards))
      } else {
        throw new DiscordooError(
          source, 'invalid "shards" option:',
          'if type of "shards" is string, it cannot be anything expect "auto"'
        )
      }
      break

    default:
      throw new DiscordooError(
        source, 'invalid "shards" option:',
        'received disallowed type:', typeof shards
      )
  }

  if (options.totalShards && !isNaN(parseInt(options.totalShards as any))) {
    result.shardsInTotal = options.totalShards
  }

  result.url = gatewayUrl + '/'
    + '?encoding=' + (options.encoding || WebSocketUtils.encoding)
    + '&v=' + (options.version || 9)
    + (options.compress ? '&compress=zlib-stream' : '')

  if (sessionStartLimit.remaining < result.shardsToSpawn.length) {
    throw new DiscordooError(
      'WebSocketManager',
      'cannot start shard' + (result.shardsToSpawn.length > 1 ? 's' : ''),
      result.shardsToSpawn.join(', '),
      'because the remaining number of session starts the current user is allowed is',
      sessionStartLimit.remaining,
      'but needed',
      result.shardsToSpawn.length + '.'
    )
  }

  return result as WsOptionsInspectionResult

}
