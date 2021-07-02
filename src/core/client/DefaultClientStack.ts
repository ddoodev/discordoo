// import { RequestBuilder } from '@src/core/providers/rest/RequestBuilder'
import { ClientEventsHandlers } from '@src/core/client/ClientEventsHandlers'
import { IpcServer } from '@src/sharding/ipc/IpcServer'
import { CacheProvider, GatewayProvider } from '@src/core'

export interface DefaultClientStack {
  cache: CacheProvider
  rest: any // RequestBuilder
  events: ClientEventsHandlers
  gateway: GatewayProvider
  ipc: IpcServer
}
