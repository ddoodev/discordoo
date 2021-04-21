import { RESTRequestBuilder } from '@src/rest'
import { Constants } from '@src/core'
import { RESTGetAPIGatewayBotResult } from 'discord-api-types'

export default async function getGateway(token: string): Promise<RESTGetAPIGatewayBotResult> {
  const req = new RESTRequestBuilder(token, Constants.DEFAULT_REST_OPTIONS).url('gateway', 'bot')
  return (await req.get<RESTGetAPIGatewayBotResult>({})).body
}