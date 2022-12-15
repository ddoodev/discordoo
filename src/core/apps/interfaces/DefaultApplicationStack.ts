import { ApplicationEventsHandlers } from '@src/events/apps/ApplicationEventsHandlers'
import { CacheProvider, GatewayProvider, RestProvider } from '@discordoo/providers'

export interface DefaultApplicationStack {
  cache: CacheProvider
  rest: RestProvider
  gateway: GatewayProvider
  events: ApplicationEventsHandlers
}
