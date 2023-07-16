import { AbstractUiAppCommandInteractionData } from '@src/api/entities/interaction/interactions/AbstractUiAppCommandInteractionData'
import { Message } from '@src/api'
import { CacheManagerGetOptions } from '@src/cache'
import { AppCommandTypes } from '@src/constants'

export class MessageAppCommandInteractionData extends AbstractUiAppCommandInteractionData {
  declare type: AppCommandTypes.Message

  async target(options?: CacheManagerGetOptions): Promise<Message | undefined> {
    const target = this.resolved.messages.get(this.targetId)
    if (target) return target

    if (!this._channelId) return undefined

    return this.app.messages.cache.get(this.targetId, { ...options, storage: this._channelId })
  }
}
