import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { MessagesManager } from '@src/api/managers/MessagesManager'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { SendOptions } from '@src/api/entities/message/interfaces/SendOptions'
import { is } from 'typescript-is'
import { ValidationError } from '@src/utils'

export abstract class AbstractChannel extends AbstractEntity {
  public abstract messages: MessagesManager
  public abstract id: string

  send(content: MessageContent, options: SendOptions = {}) {
    if (!is<SendOptions>(options)) throw new ValidationError('Channel#send', 'well, you send something wrong')

    // TODO: use resolveFiles, resolveEmbeds, resolveStickers, resolveComponents here
  }
}
