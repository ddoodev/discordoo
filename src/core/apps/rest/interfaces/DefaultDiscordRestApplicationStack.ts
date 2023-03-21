import { RestProvider } from '@discordoo/providers'
import { RestApplicationEventsHandlers } from '@src/events'
import { DefaultCacheApplicationStack } from '@src/core'

export interface DefaultDiscordRestApplicationStack extends DefaultCacheApplicationStack {
  rest: RestProvider
  events: RestApplicationEventsHandlers
}