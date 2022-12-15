import { DefaultApplicationStack } from '@src/core/apps/interfaces/DefaultApplicationStack'
import { RestManager } from '@src/rest/RestManager'
import { CacheManager } from '@src/cache/CacheManager'
import { GatewayManager } from '@src/gateway/GatewayManager'
import { ApplicationShardingMetadata } from '@src/core/apps/interfaces/ApplicationShardingMetadata'
import { ApplicationActions } from '@src/core/apps/ApplicationActions'
import { ApplicationMetadata } from '@src/core/apps/interfaces/ApplicationMetadata'
import { ApplicationEvents } from '@src/events'
import { LocalIpcServer } from '@src/sharding'
import { ApplicationQueues } from '@src/core/apps/interfaces/ApplicationQueues'
import { CompletedClientOptions } from '@src/core/apps/interfaces/ApplicationOptions'

export interface ApplicationInternalApi<ApplicationStack extends DefaultApplicationStack = DefaultApplicationStack> {
  /** Inter-process communication server used by this app */
  ipc: LocalIpcServer

  /** RestManager used by this app */
  rest: RestManager<ApplicationStack['rest']>

  /** CacheManager used by this app */
  cache: CacheManager<ApplicationStack['cache']>

  /** GatewayManager used by this app */
  gateway: GatewayManager<ApplicationStack['gateway']>

  /** Sharding metadata */
  sharding: ApplicationShardingMetadata

  /** Rest/Ws actions that app can perform */
  actions: ApplicationActions

  /** Metadata for custom providers and libraries */
  metadata: ApplicationMetadata

  /** Event handlers for this app */
  events: ApplicationEvents

  /** Various queues for this app (like guild members chunk queue) */
  queues: ApplicationQueues

  /** All completed app options */
  options: CompletedClientOptions
}
