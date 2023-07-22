import { StickerData } from '@src/api/entities/sticker'

export interface StickerPackData {
  id: string
  stickers: StickerData[]
  name: string
  skuId: string
  coverStickerId?: string
  description: string
  bannerAssetId: string
}
