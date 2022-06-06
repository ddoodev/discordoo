import { DefaultClientStack } from '@src/core/client/DefaultClientStack'
import { RestManager } from '@src/rest/RestManager'
import { CacheManager } from '@src/cache/CacheManager'
import { GatewayManager } from '@src/gateway/GatewayManager'
import { ClientShardingMetadata } from '@src/core/client/ClientShardingMetadata'
import { ClientActions } from '@src/core/client/ClientActions'
import { ClientMetadata } from '@src/core/client/ClientMetadata'
import { ClientEvents } from '@src/events'
import { LocalIpcServer } from '@src/sharding'
import { ClientQueues } from '@src/core/client/ClientQueues'
import { CompletedClientOptions } from '@src/core/client/ClientOptions'

export interface ClientInternals<ClientStack extends DefaultClientStack = DefaultClientStack> {
  /** Inter-process communication server used by this client */
  ipc: LocalIpcServer

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

  /** Event handlers for this client */
  events: ClientEvents

  /** Various queues for this client (like guild members chunk queue) */
  queues: ClientQueues

  /** All completed client options */
  options: CompletedClientOptions
}
