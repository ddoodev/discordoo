import { DiscordooProviders } from '@src/constants'
import { ProviderConstructor } from '@src/core'

export interface ProviderOption {
  provide: DiscordooProviders
  useClass: ProviderConstructor<any>
  useOptions: any
}
