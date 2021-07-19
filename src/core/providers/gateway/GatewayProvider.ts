import { GatewayConnectOptions } from '@src/core/providers/gateway/options/GatewayConnectOptions'
import { Provider } from '@src/core/providers/Provider'

export interface GatewayProvider extends Provider {
  connect(options?: GatewayConnectOptions): Promise<unknown>

  disconnect(): Promise<unknown>
}
