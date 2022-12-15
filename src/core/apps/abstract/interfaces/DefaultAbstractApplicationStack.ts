import { CacheProvider } from '@discordoo/providers'
import { AbstractApplicationEventsHandlers } from '@src/events/apps'

export interface DefaultAbstractApplicationStack {
  cache: CacheProvider
  events: AbstractApplicationEventsHandlers
}