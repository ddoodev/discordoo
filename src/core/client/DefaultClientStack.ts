import { ClientEventsHandlers } from '@src/core'
import { CacheProvider, GatewayProvider, RestProvider } from '@discordoo/providers'

export interface DefaultClientStack {
  cache: CacheProvider
  rest: RestProvider
  gateway: GatewayProvider
  events: ClientEventsHandlers
}
