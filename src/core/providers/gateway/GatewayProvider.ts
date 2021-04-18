import { GatewayReceivePayload, GatewaySendPayload } from 'discord-api-types'

type GatewayProviderSub = (callback: (message: GatewayReceivePayload) => any) => void

interface GatewayProviderUtils {
  error: (callback: () => any) => void
  prepare: (token: string) => Promise<void>
  send: (payload: GatewaySendPayload) => Promise<void>
}

type GatewayProvider<T extends GatewayProviderUtils = GatewayProviderUtils> = () => GatewayProviderSub & T

export {
  GatewayProviderSub,
  GatewayProviderUtils,
  GatewayProvider
}
