import { Interaction } from '../../../../../src/api/entities/interaction/interactions/Interaction'
import {
  InteractionMessageContent,
  InteractionMessageCreateOptions,
  InteractionMessageEditOptions,
  MessageResolvable
} from '../../../../../src/api'

export abstract class WritableInteraction extends Interaction {
  async deferReply(ephemeral?: boolean): Promise<this | undefined> {
    const result = await this.app.interactions.deferReply(this.id, this.token, ephemeral)
    return result ? this : undefined
  }

  async deleteReply(message?: MessageResolvable): Promise<this | undefined> {
    const result = await this.app.interactions.deleteReply(this.token, message)
    return result ? this : undefined
  }

  async editFollowUp(message: MessageResolvable, content: InteractionMessageContent) {
    return await this.app.interactions.editFollowUp(this.app.user.id, this.token, message, content)
  }

  async editReply(content: InteractionMessageContent, options?: InteractionMessageEditOptions) {
    return await this.app.interactions.editReply(this.token, content, options)
  }

  async fetchFollowUp(message: MessageResolvable) {
    return await this.app.interactions.fetchFollowUp(this.app.user.id, this.token, message)
  }

  async fetchReply() {
    return await this.app.interactions.fetchReply(this.app.user.id, this.token)
  }

  async reply(content: InteractionMessageContent, options?: InteractionMessageCreateOptions): Promise<this | undefined> {
    const result = await this.app.interactions.reply(this.id, this.token, content, options)
    return result ? this : undefined
  }

  async replyFollowUp(content: InteractionMessageContent, options?: InteractionMessageCreateOptions) {
    return await this.app.interactions.replyFollowUp(this.app.user.id, this.token, content, options)
  }
}
