import { ProviderOption } from '@src/core'
import { GatewayOptions } from '@src/gateway'
import { Optional } from '@src/utils'
import { IpcServerOptions } from '@src/sharding'
import { CachingOptions } from '@src/cache/interfaces/CachingOptions'

export interface ClientOptions<CustomOptions = any> {
  providers?: ProviderOption[]
  gateway?: Optional<GatewayOptions, 'token' | 'intents' | 'properties'>
  cache?: CachingOptions
  rest?: any
  ipc?: Optional<IpcServerOptions, 'instanceIpc' | 'managerIpc' | 'instance'>
  custom?: CustomOptions
}
