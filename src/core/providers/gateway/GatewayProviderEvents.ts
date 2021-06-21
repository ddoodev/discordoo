import {GatewayReceivePayload} from 'discord-api-types'

export default interface GatewayProviderEvents {
  message: (data: GatewayReceivePayload) => any
}
