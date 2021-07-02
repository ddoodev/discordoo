import { GatewayConnectOptions } from '@src/core/providers/gateway/options/GatewayConnectOptions'

export interface GatewayProvider {
  connect(options?: GatewayConnectOptions): Promise<unknown>

  disconnect(): Promise<unknown>
}
