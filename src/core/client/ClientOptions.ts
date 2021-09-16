import { ProviderOption } from '@src/core'
import { GatewayOptions } from '@src/gateway'
import { Optional } from '@src/utils'
import { IpcServerOptions } from '@src/sharding'
import { CachingOptions } from '@src/cache/interfaces/CachingOptions'
import { RestOptions } from '@src/rest/interfaces/RestOptions'
import { ExtendedEntityOption } from '@src/core/client/ExtendedEntityOption'

export interface ClientOptions<CustomOptions = any> {
  providers?: ProviderOption[]
  gateway?: Optional<GatewayOptions, 'token' | 'intents' | 'properties'>
  cache?: CachingOptions
  rest?: RestOptions
  ipc?: Optional<IpcServerOptions, 'instanceIpc' | 'managerIpc' | 'instance'>
  custom?: CustomOptions
  extenders?: ExtendedEntityOption[]
}
