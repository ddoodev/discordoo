import { GatewayReceivePayload } from 'discord-api-types'

export default interface GatewayProviderEvents {
  message: (msg: GatewayReceivePayload) => any
  error: (err: Error) => any
}