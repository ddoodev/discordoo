import { RESTRequestBuilder } from '@src/rest'
import { APIGatewayBotInfo, RESTGetAPIGatewayBotResult } from 'discord-api-types'
import { DEFAULT_REST_OPTIONS } from '@src/core/Constants'

export default function getGateway(token: string): Promise<APIGatewayBotInfo> {
  const requester = new RESTRequestBuilder(token, DEFAULT_REST_OPTIONS)

  return requester.url('gateway', 'bot').get<RESTGetAPIGatewayBotResult>()
    .then(response => response.body)
}
