import { AbstractMessagesManager } from '@src/api/managers/messages/AbstractMessagesManager'
import { MessageResolvable } from '@src/api'

export class DirectMessagesChannelMessagesManager extends AbstractMessagesManager {

  delete(message: MessageResolvable, reason?: string): Promise<boolean> {
    return this.app.messages.deleteOne(this.channelId, message, reason)
  }

}
