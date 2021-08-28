import { ClientEventsHandlers } from '@src/core/client/ClientEventsHandlers'
import { IpcServer } from '@src/sharding/ipc/IpcServer'
import { CacheProvider, GatewayProvider, RestProvider } from '@discordoo/providers'

export interface DefaultClientStack {
  cache: CacheProvider
  rest: RestProvider
  gateway: GatewayProvider
  ipc: IpcServer
  events: ClientEventsHandlers
}
