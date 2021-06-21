import GatewayProviderAPI from '@src/core/providers/gateway/GatewayProviderAPI'

type GatewayProvider<T extends GatewayProviderAPI = GatewayProviderAPI> = () => T

export default GatewayProvider
