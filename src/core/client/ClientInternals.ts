import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { ShardingInstanceEnvironment } from '@src/sharding/interfaces/client/ShardingInstanceEnvironment'

export interface ClientInternals<ClientStack extends DefaultClientStack = DefaultClientStack> {
  /** Inter-process communication server used by this client */
  ipc: ClientStack['ipc']

  /** RESTProvider used by this client */
  rest: ClientStack['rest']

  /** CacheProvider used by this client */
  cache: ClientStack['cache']

  /** GatewayProvider used by this client */
  gateway: ClientStack['gateway']

  /** Sharding Environment */
  env: ShardingInstanceEnvironment
}
