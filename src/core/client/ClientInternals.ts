import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { RestManager } from '@src/rest/RestManager'
import { CacheManager } from '@src/cache/CacheManager'
import { GatewayManager } from '@src/gateway/GatewayManager'
import { ClientShardingMetadata } from '@src/core/client/ClientShardingMetadata'
import { ClientActions } from '@src/core/client/ClientActions'

export interface ClientInternals<ClientStack extends DefaultClientStack = DefaultClientStack> {
  /** Inter-process communication server used by this client */
  ipc: ClientStack['ipc']

  /** RestManager used by this client */
  rest: RestManager<ClientStack['rest']>

  /** CacheManager used by this client */
  cache: CacheManager<ClientStack['cache']>

  /** GatewayManager used by this client */
  gateway: GatewayManager<ClientStack['gateway']>

  /** Sharding metadata */
  sharding: ClientShardingMetadata

  /** Rest/Ws actions that client can perform */
  actions: ClientActions
}
