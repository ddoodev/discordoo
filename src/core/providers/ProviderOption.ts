import { DiscordooProviders } from '@src/core/Constants'
import { Client } from '@src/core'

export interface ProviderOption {
  provide: DiscordooProviders
  use: <P>(client: Client) => P
  useClass: any
}
