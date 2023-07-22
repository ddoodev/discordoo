import {
  CacheApplicationInternals,
  CompletedRestApplicationOptions,
  DefaultDiscordRestApplicationStack, RestApplicationActions,
  RestApplicationMetadata
} from '../../../../../src/core'
import { RestManager } from '../../../../../src/rest'

export interface RestApplicationInternals<ApplicationStack extends DefaultDiscordRestApplicationStack = DefaultDiscordRestApplicationStack>
  extends CacheApplicationInternals<ApplicationStack> {

  /** Rest actions that app can perform */
  actions: RestApplicationActions

  /** RestManager used by this app */
  rest: RestManager<ApplicationStack['rest']>

  /** Metadata for custom providers and libraries */
  metadata: RestApplicationMetadata

  /** All completed app options */
  options: CompletedRestApplicationOptions
}