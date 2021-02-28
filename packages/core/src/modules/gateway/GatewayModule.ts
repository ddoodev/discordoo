import CoreModule from '../CoreModule'
import GatewayModuleConfig from './GatewayModuleConfig'
import ShardsManager from './ShardsManager'

/**
 * Gateway module interface
 * @template C connection type. Internal.
 */
export default interface GatewayModule extends CoreModule {
  /**
   * Configuration for this module
   */
  config: GatewayModuleConfig
  /**
   * ShardsManager for this module
   */
  shards: ShardsManager
}
