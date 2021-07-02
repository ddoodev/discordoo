// import { DefaultRestProvider } from '@src/rest'
import { APIGatewayBotInfo, RESTGetAPIGatewayBotResult } from 'discord-api-types'
import { DEFAULT_REST_OPTIONS } from '@src/core/Constants'

export function getGateway(token: string): Promise<APIGatewayBotInfo> {
  const requester: any = new (1 as unknown as any) /* DefaultRestProvider */(token, DEFAULT_REST_OPTIONS)

  // @ts-ignore
  return requester.url('gateway', 'bot').get<RESTGetAPIGatewayBotResult>()
    .then(response => response.body)
}
