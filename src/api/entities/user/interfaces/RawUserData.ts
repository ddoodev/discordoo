import { PremiumTypes } from '@src/constants'

export interface RawUserData {
  id: string
  username: string
  global_name?: string
  /** @deprecated */
  discriminator?: string
  avatar?: string
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  banner?: string
  accent_color?: number
  locale?: string
  verified?: boolean
  email?: string
  flags?: number
  premium_type?: PremiumTypes
  public_flags?: number
}
