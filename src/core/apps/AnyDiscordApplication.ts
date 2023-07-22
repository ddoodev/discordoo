import { DiscordApplication } from '../../../src/core'
import { DiscordRestApplication } from '../../../src/core/apps/rest/DiscordRestApplication'
import { DiscordCacheApplication } from '../../../src/core/apps/cache/DiscordCacheApplication'

export type RestEligibleDiscordApplication = DiscordApplication | DiscordRestApplication
export type AnyDiscordApplication = RestEligibleDiscordApplication  | DiscordCacheApplication