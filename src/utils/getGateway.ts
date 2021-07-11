import { APIGatewayBotInfo } from 'discord-api-types'

// FIXME: looks like this api does not fit the concept of providers and standalone gateway.
export function getGateway(token: string): Promise<APIGatewayBotInfo> {
  return Promise.resolve({
    shards: 1,
    url: 'wss://gateway.discord.gg',
    session_start_limit: {
      remaining: 999,
      reset_after: 999,
      max_concurrency: 1,
      total: 999
    }
  })
}
