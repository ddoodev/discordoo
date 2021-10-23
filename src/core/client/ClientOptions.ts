import { ProviderOption } from '@src/core'
import { GatewayOptions } from '@src/gateway'
import { Optional } from '@src/utils'
import { CacheOptions } from '@src/cache/interfaces/CacheOptions'
import { RestOptions } from '@src/rest/interfaces/RestOptions'
import { ExtendedEntityOption } from '@src/core/client/ExtendedEntityOption'
import { CompletedLocalIpcOptions } from '@src/constants/sharding/CompletedLocalIpcOptions'

export interface ClientOptions<CustomOptions = any> {
  providers?: ProviderOption[]
  gateway?: Optional<GatewayOptions, 'token' | 'intents' | 'properties'>
  cache?: CacheOptions
  rest?: RestOptions
  ipc?: CompletedLocalIpcOptions
  custom?: CustomOptions
  extenders?: ExtendedEntityOption[]
}
