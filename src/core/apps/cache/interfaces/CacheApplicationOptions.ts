import { CacheOptions } from '@src/cache'
import { CompletedLocalIpcOptions } from '@src/sharding'
import { ExtendedEntityOption, ProviderOption } from '@src/core'

export interface CacheApplicationOptions<CustomOptions = any> {
  providers?: ProviderOption[]
  cache?: CacheOptions
  ipc?: CompletedLocalIpcOptions
  custom?: CustomOptions
  extenders?: ExtendedEntityOption[]
}