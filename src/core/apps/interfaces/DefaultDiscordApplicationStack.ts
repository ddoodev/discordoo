import { GatewayProvider } from '@discordoo/providers'
import { ApplicationEventsHandlers } from '@src/events'
import { DefaultDiscordRestApplicationStack } from '@src/core'

export interface DefaultDiscordApplicationStack extends DefaultDiscordRestApplicationStack {
  gateway: GatewayProvider
  events: ApplicationEventsHandlers
}
