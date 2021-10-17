import { Resolvable } from '@src/api'
import { RawStickerData, Sticker, StickerData } from '@src/api/entities/sticker'

export type StickerResolvable = Resolvable<Sticker | StickerData | RawStickerData>
