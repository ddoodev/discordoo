import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { RESTProvider } from '@src/core/providers/rest/RESTProvider'
import { CacheProvider } from '@src/core/providers/cache/CacheProvider'
import { GatewayProvider } from '@src/core'
import { ShardingClientEnvironment } from '@src/sharding/interfaces/client/ShardingClientEnvironment'

export interface ClientInternals<ClientStack extends DefaultClientStack = DefaultClientStack> {
  /** Inter-process communication server used by this client */
  ipc: ClientStack['ipc']

  /** RESTProvider used by this client */
  rest: RESTProvider<ClientStack['rest']>

  /** CacheProvider used by this client */
  cache: CacheProvider<ClientStack['cache']>

  /** GatewayProvider used by this client */
  gateway: GatewayProvider<ClientStack['gateway']>

  env: ShardingClientEnvironment
}
