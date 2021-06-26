import { GatewayReceivePayload } from 'discord-api-types'

export interface GatewayProviderEvents {
  message: (data: GatewayReceivePayload) => any
}
