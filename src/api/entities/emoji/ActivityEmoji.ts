import { AbstractEmoji } from '@src/api/entities/emoji/AbstractEmoji'
import { ActivityEmojiData } from '@src/api/entities/emoji/interfaces/ActivityEmojiData'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class ActivityEmoji extends AbstractEmoji {
  public declare name: string

  init(data: ActivityEmojiData, options?: EntityInitOptions): Promise<this> {
    return super.init(data, options)
  }
}
