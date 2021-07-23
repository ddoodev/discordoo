import { ProviderOption } from '@src/core'
import { GatewayOptions } from '@src/gateway'
import { Optional } from '@src/utils'
// import { RESTOptions } from '@src/rest'
import { IpcServerOptions } from '@src/sharding'

export interface ClientOptions<CustomOptions = any> {
  providers?: ProviderOption[]
  gateway?: Optional<GatewayOptions, 'token' | 'intents' | 'properties'>
  rest?: any
  ipc?: Optional<IpcServerOptions, 'instanceIpc' | 'managerIpc' | 'instance'>
  custom?: CustomOptions
}
