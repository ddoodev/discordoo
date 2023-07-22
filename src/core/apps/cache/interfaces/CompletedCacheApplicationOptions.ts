import { CompletedCacheOptions } from '../../../../../src/cache'
import { CompletedLocalIpcOptions } from '../../../../../src/sharding'

export interface CompletedCacheApplicationOptions {
  cache: CompletedCacheOptions
  ipc: CompletedLocalIpcOptions
}