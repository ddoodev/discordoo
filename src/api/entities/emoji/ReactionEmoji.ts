import { AbstractEmoji } from '@src/api/entities/emoji/AbstractEmoji'
import { ReactionEmojiData } from '@src/api/entities/emoji/interfaces/ReactionEmojiData'

export class ReactionEmoji extends AbstractEmoji {
  public reaction: any /** MessageReaction */ // TODO

  async init(data: ReactionEmojiData): Promise<this> {
    await super.init(data)

    // this.reaction = await resolveReaction(data.reaction) // TODO
    this.reaction = data.reaction

    return this
  }
}
