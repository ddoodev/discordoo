import { RequestBuilder } from '@src/core/providers/rest/RequestBuilder'
import { ClientEventsHandlers } from '@src/core/client/ClientEventsHandlers'
import { IpcServer } from '@src/sharding/ipc/IpcServer'
import { GatewayProviderAPI } from '@src/core/providers/gateway/GatewayProviderAPI'
import { CacheProvider } from '@src/core'

export interface DefaultClientStack {
  cache: CacheProvider
  rest: RequestBuilder
  events: ClientEventsHandlers
  gateway: GatewayProviderAPI
  ipc: IpcServer
}
