import { StickerFormatTypes, StickerTypes } from '@src/constants'
import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'

export interface RawStickerData {
  id: string
  pack_id?: string
  name: string
  description?: string
  tags: string
  type: StickerTypes
  format_type: StickerFormatTypes
  available?: boolean
  guild_id?: string
  user?: RawUserData
  sort_value?: number
}
