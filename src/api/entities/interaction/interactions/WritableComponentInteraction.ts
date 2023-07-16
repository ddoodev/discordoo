import { WritableModalInteraction } from '@src/api/entities/interaction/interactions/WritableModalInteraction'
import { InteractionMessageContent, InteractionMessageEditOptions } from '@src/api'

export abstract class WritableComponentInteraction extends WritableModalInteraction {
  async editComponentReply(
    content: InteractionMessageContent, options?: Omit<InteractionMessageEditOptions, 'message'>
  ): Promise<boolean> {
    return await this.app.interactions.editComponentReply(this.id, this.token, content, options)
  }
}
