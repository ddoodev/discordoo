import { CompletedCacheOptions } from '@src/cache'
import { CompletedLocalIpcOptions } from '@src/sharding'

export interface CompletedAbstractApplicationOptions {
  cache: CompletedCacheOptions
  ipc: CompletedLocalIpcOptions
}