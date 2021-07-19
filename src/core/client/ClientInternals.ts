import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { ShardingInstanceEnvironment } from '@src/sharding/interfaces/client/ShardingInstanceEnvironment'
import { RestManager } from '@src/rest/RestManager'
import { CacheManager } from '@src/cache/CacheManager'
import { GatewayManager } from '@src/gateway/GatewayManager'

export interface ClientInternals<ClientStack extends DefaultClientStack = DefaultClientStack> {
  /** Inter-process communication server used by this client */
  ipc: ClientStack['ipc']

  /** RestManager used by this client */
  rest: RestManager<ClientStack['rest']>

  /** CacheManager used by this client */
  cache: CacheManager<ClientStack['cache']>

  /** GatewayManager used by this client */
  gateway: GatewayManager<ClientStack['gateway']>

  /** Sharding Environment */
  env: ShardingInstanceEnvironment
}
