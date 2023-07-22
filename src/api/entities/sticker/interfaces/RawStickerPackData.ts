import { RawStickerData } from '@src/api/entities/sticker'

export interface RawStickerPackData {
  id: string
  stickers: RawStickerData[]
  name: string
  sku_id: string
  cover_sticker_id?: string
  description: string
  banner_asset_id: string
}
