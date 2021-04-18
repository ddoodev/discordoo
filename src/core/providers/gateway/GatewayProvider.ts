import { GatewaySendPayload } from 'discord-api-types'
import { TypedEmitter } from 'tiny-typed-emitter'
import GatewayProviderEvents from '@src/core/providers/gateway/GatewayProviderEvents'
import GatewayStatus from '@src/core/providers/gateway/GatewayStatus'

interface GatewayProviderAPI extends TypedEmitter<GatewayProviderEvents> {
  send: (msg: GatewaySendPayload) => Promise<void>
  status: GatewayStatus
  start: (token: string) => Promise<void>
}

type GatewayProvider<T extends GatewayProviderAPI = GatewayProviderAPI> = () => T

export {
  GatewayProvider,
  GatewayProviderAPI
}