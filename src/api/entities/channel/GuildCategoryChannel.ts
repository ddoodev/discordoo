import { AbstractGuildChannel } from '@src/api/entities/channel/AbstractGuildChannel'
import { CategoryChannelChildrensManager } from '@src/api/managers/channels/CategoryChannelChildrensManager'
import { AbstractGuildChannelData } from '@src/api/entities/channel/interfaces/AbstractGuildChannelData'
import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'
import { Keyspaces } from '@src/constants'
import { channelEntityKey } from '@src/utils'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { cachePointer } from '@src/utils/cachePointer'

export class GuildCategoryChannel extends AbstractGuildChannel {
  public childrens!: CategoryChannelChildrensManager

  async init(data: AbstractGuildChannelData | RawAbstractGuildChannelData): Promise<this> {
    await super.init(data)

    if (!this.childrens) {
      this.childrens = new CategoryChannelChildrensManager(this.client, {
        category: this.id,
        guild: this.guildId
      })
    }

    await this.childrens.cache.clear()

    const predicate = async (channel: AnyGuildChannel) => {
      if (channel.parentId === this.id) {
        await this.childrens.cache.set(channel.id, cachePointer(Keyspaces.CHANNELS, 'global', channel.id))
      }
    }

    await this.client.internals.cache.forEach(
      Keyspaces.CHANNELS,
      this.guildId,
      channelEntityKey,
      predicate
    )

    return this
  }
}
