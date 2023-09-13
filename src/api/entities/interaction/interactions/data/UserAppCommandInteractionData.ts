import { AbstractUiAppCommandInteractionData } from '@src/api/entities/interaction/interactions/data/AbstractUiAppCommandInteractionData'
import { GuildMember } from '@src/api'
import { CacheManagerGetOptions } from '@src/cache'
import { AppCommandTypes } from '@src/constants'

export class UserAppCommandInteractionData extends AbstractUiAppCommandInteractionData {
  declare type: AppCommandTypes.User

  async target(options?: CacheManagerGetOptions): Promise<GuildMember | undefined> {
    const target = this.resolved.members.get(this.targetId)
    if (target) return target

    if (!this._guildId && typeof options?.storage !== 'string') return undefined

    return this.app.members.cache.get(this.targetId, { storage: this._guildId, ...options })
  }
}
