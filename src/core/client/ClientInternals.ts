import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { ShardingClientEnvironment } from '@src/sharding/interfaces/client/ShardingClientEnvironment'

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
  env: ShardingClientEnvironment
}
