import { AbstractMessagesManager } from '@src/api/managers/messages/AbstractMessagesManager'
import { MessageResolvable } from '@src/api'
import { DeleteManyMessagesOptions } from '@src/api/managers/messages/DeleteManyMessagesOptions'

export class ChannelMessagesManager extends AbstractMessagesManager {

  delete(
    message: MessageResolvable | MessageResolvable[] | number, options?: DeleteManyMessagesOptions | string
  ): Promise<boolean | string[] | undefined> {
    return this.app.messages.delete(this.channelId, message, options)
  }

  deleteOne(message: MessageResolvable, reason?: string): Promise<boolean> {
    return this.app.messages.deleteOne(this.channelId, message, reason)
  }

  deleteMany(messages: MessageResolvable[] | number, options?: DeleteManyMessagesOptions): Promise<string[] | undefined> {
    return this.app.messages.deleteMany(this.channelId, messages, options)
  }

}
