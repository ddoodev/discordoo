import { ClientEventsHandlers } from '@src/events/ClientEventsHandlers'
import { CacheProvider, GatewayProvider, RestProvider } from '@discordoo/providers'

export interface DefaultClientStack {
  cache: CacheProvider
  rest: RestProvider
  gateway: GatewayProvider
  events: ClientEventsHandlers
}
