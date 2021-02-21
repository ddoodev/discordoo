import CoreModule from '../CoreModule'
import GatewayModuleConfig from './GatewayModuleConfig'
import ShardsManager from './ShardsManager'

export default interface GatewayModule<C> extends CoreModule {
  config: GatewayModuleConfig
  shards: ShardsManager<C>
}
