import { StickerFormatTypes, StickerTypes } from '@src/constants'
import { UserResolvable } from '@src/api/entities/user/interfaces/UserResolvable'

export interface StickerData {
  id: string
  packId?: string
  name: string
  description?: string
  tags: string[]
  type: StickerTypes
  formatType: StickerFormatTypes
  available?: boolean
  guildId?: string
  user?: UserResolvable
  userId?: string
  sortValue?: number
}
