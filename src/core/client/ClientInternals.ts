import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { RestManager } from '@src/rest/RestManager'
import { CacheManager } from '@src/cache/CacheManager'
import { GatewayManager } from '@src/gateway/GatewayManager'
import { ClientShardingMetadata } from '@src/core/client/ClientShardingMetadata'
import { ClientActions } from '@src/core/client/ClientActions'
import { ClientMetadata } from '@src/core/client/ClientMetadata'
import { ClientEvents } from '@src/events'
import { IpcServer } from '@src/sharding'

export interface ClientInternals<ClientStack extends DefaultClientStack = DefaultClientStack> {
  /** Inter-process communication server used by this client */
  ipc: IpcServer

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

  /** Metadata for custom providers and libraries */
  metadata: ClientMetadata

  /** Events handler for this client */
  events: ClientEvents
}
