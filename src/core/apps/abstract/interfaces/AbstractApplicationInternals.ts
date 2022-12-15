import { DefaultAbstractApplicationStack } from './DefaultAbstractApplicationStack'
import { LocalIpcServer } from '@src/sharding'
import { CacheManager } from '@src/cache'
import { ApplicationMetadata, ApplicationShardingMetadata } from '@src/core'
import { ApplicationEvents } from '@src/events'
import { AbstractApplicationShardingMetadata } from './AbstractApplicationShardingMetadata'

export interface AbstractApplicationInternals<Stack extends DefaultAbstractApplicationStack = DefaultAbstractApplicationStack> {
  /** Inter-process communication server used by this app */
  ipc: LocalIpcServer // TODO ipc provider

  /** CacheManager used by this app */
  cache: CacheManager<Stack['cache']>

  /** Metadata for custom providers and libraries */
  metadata: ApplicationMetadata

  /** Sharding metadata */
  sharding: ApplicationShardingMetadata

  /** Event handlers for this app */
  events: ApplicationEvents
}