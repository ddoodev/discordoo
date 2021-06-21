import { TypedEmitter } from 'tiny-typed-emitter'
import GatewayProviderEvents from '@src/core/providers/gateway/GatewayProviderEvents'

export default interface GatewayProviderAPI extends TypedEmitter<GatewayProviderEvents> {
  connect(): Promise<void>
  disconnect(): Promise<void>
}
