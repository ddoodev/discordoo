import { GatewayProvider } from '../../../../../providers/src/_index'
import { ApplicationEventsHandlers } from '../../../../src/events'
import { DefaultDiscordRestApplicationStack } from '../../../../src/core'

export interface DefaultDiscordApplicationStack extends DefaultDiscordRestApplicationStack {
  gateway: GatewayProvider
  events: ApplicationEventsHandlers
}
