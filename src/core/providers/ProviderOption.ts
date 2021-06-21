import { DiscordooProviders } from '@src/core/Constants'
import { Client } from '@src/core'

export default interface ProviderOption {
  provide: DiscordooProviders
  use: <P>(client: Client) => P
}
