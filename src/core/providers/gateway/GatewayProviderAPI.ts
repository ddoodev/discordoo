import { TypedEmitter } from 'tiny-typed-emitter'
import { GatewayProviderEvents } from '@src/core/providers/gateway/GatewayProviderEvents'
import { GatewayConnectOptions } from '@src/gateway/interfaces/GatewayConnectOptions'

export interface GatewayProviderAPI extends TypedEmitter<GatewayProviderEvents> {
  connect(options?: GatewayConnectOptions): Promise<void>
  disconnect(): Promise<void>
}
