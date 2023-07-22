import { CacheProvider } from '@discordoo/providers'
import { AbstractApplicationEventsHandlers } from '@src/events/apps'

export interface DefaultCacheApplicationStack {
  cache: CacheProvider
  events: AbstractApplicationEventsHandlers
}