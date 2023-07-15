import { WritableInteraction } from '@src/api/entities/interaction/interactions/WritableInteraction'
import { InteractionMessageContent, InteractionMessageEditOptions } from '@src/api'

export abstract class WritableComponentInteraction extends WritableInteraction {
  async editComponentReply(
    content: InteractionMessageContent, options?: Omit<InteractionMessageEditOptions, 'message'>
  ): Promise<boolean> {
    return await this.app.interactions.editComponentReply(this.id, this.token, content, options)
  }
}
