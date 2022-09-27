import { DiscordooProviders } from '@src/constants'
import { ProviderConstructor, RestProviderConstructor } from '@src/core/providers/ProviderConstructor'

export interface ProviderOption {
  provide: DiscordooProviders
  useClass: ProviderConstructor<any> | RestProviderConstructor<any>
  useOptions: any
}
