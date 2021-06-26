import { GatewayProviderAPI } from '@src/core/providers/gateway/GatewayProviderAPI'

export type GatewayProvider<T extends GatewayProviderAPI = GatewayProviderAPI> = () => T
