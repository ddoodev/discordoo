import { LocalIpcServer } from '@src/sharding'
import { ApplicationEvents } from '@src/events'
import {
  ApplicationShardingMetadata,
  CacheApplicationMetadata,
  CompletedCacheApplicationOptions,
  DefaultCacheApplicationStack
} from '@src/core'
import { CacheManager } from '@src/cache'

export interface CacheApplicationInternals<Stack extends DefaultCacheApplicationStack = DefaultCacheApplicationStack> {
  /** Inter-process communication server used by this app */
  ipc: LocalIpcServer // TODO ipc provider

  /** CacheManager used by this app */
  cache: CacheManager<Stack['cache']>

  /** Metadata for custom providers and libraries */
  metadata: CacheApplicationMetadata

  /** Sharding metadata */
  sharding: ApplicationShardingMetadata

  /** Event handlers for this app */
  events: ApplicationEvents

  /** All completed app options */
  options: CompletedCacheApplicationOptions
}