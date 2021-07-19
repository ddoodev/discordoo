import { ClientEventsHandlers } from '@src/core/client/ClientEventsHandlers'
import { IpcServer } from '@src/sharding/ipc/IpcServer'
import { CacheProvider, GatewayProvider } from '@src/core'
import { RestProvider } from '@src/core/providers/rest/RestProvider'

export interface DefaultClientStack {
  cache: CacheProvider
  rest: RestProvider
  gateway: GatewayProvider
  ipc: IpcServer
  events: ClientEventsHandlers
}
