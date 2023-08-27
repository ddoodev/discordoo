import { BitFieldResolvable } from '@src/utils/bitfield'
import { PremiumTypes } from '@src/constants'

export interface UserData {
  id: string
  username: string
  discriminator: string
  globalName?: string
  avatar?: string
  bot?: boolean
  system?: boolean
  mfaEnabled?: boolean
  banner?: string
  accentColor?: number
  locale?: string
  verified?: boolean
  email?: string
  flags?: BitFieldResolvable
  premiumType?: PremiumTypes
}
