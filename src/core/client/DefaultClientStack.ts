import { CacheNamespace } from '@src/core/providers/cache/CacheNamespace'
import { RequestBuilder } from '@src/core/providers/rest/RequestBuilder'
import { ClientEventsHandlers } from '@src/core/client/ClientEventsHandlers'
import { IpcServer } from '@src/sharding/ipc/IpcServer'
import { GatewayProviderAPI } from '@src/core/providers/gateway/GatewayProviderAPI'

export interface DefaultClientStack {
  cache: CacheNamespace
  rest: RequestBuilder
  events: ClientEventsHandlers
  gateway: GatewayProviderAPI
  ipc: IpcServer
}
