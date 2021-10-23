import { AbstractEmoji } from '@src/api/entities/emoji/AbstractEmoji'
import { ActivityEmojiData } from '@src/api/entities/emoji/interfaces/ActivityEmojiData'

export class ActivityEmoji extends AbstractEmoji {
  public name!: string

  init(data: ActivityEmojiData): Promise<this> {
    return super.init(data)
  }
}
