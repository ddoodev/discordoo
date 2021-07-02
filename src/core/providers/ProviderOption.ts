import { DiscordooProviders } from '@src/core/Constants'
import { ProviderConstructor } from '@src/core/providers/ProviderConstructor'

export interface ProviderOption {
  provide: DiscordooProviders
  useClass: ProviderConstructor<any>
  useOptions: any
}
