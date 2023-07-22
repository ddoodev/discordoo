import {
  ApplicationActions,
  ApplicationMetadata,
  ApplicationQueues, ApplicationShardingMetadata, CompletedApplicationOptions,
  DefaultDiscordApplicationStack,
  RestApplicationInternals
} from '@src/core'
import { GatewayManager } from '@src/gateway'

export interface ApplicationInternals<ApplicationStack extends DefaultDiscordApplicationStack = DefaultDiscordApplicationStack>
  extends RestApplicationInternals<ApplicationStack> {

  /** GatewayManager used by this app */
  gateway: GatewayManager<ApplicationStack['gateway']>

  /** Sharding metadata */
  sharding: ApplicationShardingMetadata

  /** Rest/Ws actions that app can perform */
  actions: ApplicationActions

  /** Metadata for custom providers and libraries */
  metadata: ApplicationMetadata

  /** Various queues for this app (like guild members chunk queue) */
  queues: ApplicationQueues

  /** All completed app options */
  options: CompletedApplicationOptions
}