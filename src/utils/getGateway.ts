import { RESTRequestBuilder } from '@src/rest'
import { Constants } from '@src/core'
import { APIGatewayBotInfo, RESTGetAPIGatewayBotResult } from 'discord-api-types'

export default function getGateway(token: string): Promise<APIGatewayBotInfo> {
  const requester = new RESTRequestBuilder(token, Constants.DEFAULT_REST_OPTIONS)

  return requester.url('gateway', 'bot').get<RESTGetAPIGatewayBotResult>()
    .then(response => response.body)
}
