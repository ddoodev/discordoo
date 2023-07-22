import { RestApplicationMetadata } from '../../../../src/core'

/** DiscordApplication metadata for custom providers and libraries */
export interface ApplicationMetadata extends RestApplicationMetadata {
  /** Discord Gateway version used by this app */
  gatewayVersion: number
}
