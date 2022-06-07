import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { StickerPackData } from '@src/api/entities/sticker/interfaces/StickerPackData'
import { Sticker } from '@src/api/entities/sticker/Sticker'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'
import { idToDate, idToTimestamp, ImageUrlOptions, attach } from '@src/utils'
import { RawStickerPackData } from '@src/api/entities/sticker/interfaces/RawStickerPackData'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { Collection } from '@discordoo/collection'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class StickerPack extends AbstractEntity {
  public declare bannerAssetId: string
  public coverStickerId?: string
  public declare description: string
  public declare id: string
  public declare name: string
  public declare skuId: string
  public stickers: Collection<string, Sticker> = new Collection()

  async init(data: StickerPackData | RawStickerPackData, options?: EntityInitOptions): Promise<this> {

    if (data.stickers) {
      const stickers = new Collection<string, Sticker>()
      const Sticker = EntitiesUtil.get('Sticker')

      for await (const stickerData of data.stickers) {
        const sticker = await new Sticker(this.client).init(stickerData)
        stickers.set(sticker.id, sticker)
      }

      (data as any).stickers = stickers
    }

    attach(this, data, {
      props: [
        [ 'bannerAssetId', 'banner_asset_id' ],
        [ 'coverStickerId', 'cover_sticker_id' ],
        'description',
        'id',
        'name',
        [ 'skuId', 'sku_id' ],
        'stickers'
      ],
      disabled: options?.ignore,
      enabled: [ 'id', 'bannerAssetId' ]
    })

    return this
  }

  get createdTimestamp(): number {
    return idToTimestamp(this.id)
  }

  get createdDate(): Date {
    return idToDate(this.id)
  }

  get coverSticker(): Sticker | undefined {
    return this.coverStickerId ? this.stickers.get(this.coverStickerId) : undefined
  }

  bannerUrl(options?: ImageUrlOptions): string {
    return this.client.internals.rest.cdn.stickerPackBanner(this.bannerAssetId, options)
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      bannerAssetId: true,
      coverStickerId: true,
      description: true,
      id: true,
      name: true,
      skuId: true,
      stickers: true,
    }, obj)
  }

}
