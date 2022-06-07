import { AbstractGuildChannel } from '@src/api/entities/channel/AbstractGuildChannel'
import { CategoryChannelChildrenManager } from '@src/api/managers/channels/CategoryChannelChildrenManager'
import { AbstractGuildChannelData } from '@src/api/entities/channel/interfaces/AbstractGuildChannelData'
import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'
import { ChannelTypes, Keyspaces } from '@src/constants'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { makeCachePointer } from '@src/utils/cachePointer'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class GuildCategoryChannel extends AbstractGuildChannel {
  public declare children: CategoryChannelChildrenManager
  public declare type: ChannelTypes.GUILD_CATEGORY

  async init(data: AbstractGuildChannelData | RawAbstractGuildChannelData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    if (!this.children) {
      this.children = new CategoryChannelChildrenManager(this.client, {
        category: this.id,
        guild: this.guildId
      })
    }

    await this.children.cache.clear()

    const predicate = async (channel: AnyGuildChannel) => {
      if (channel.parentId === this.id) {
        await this.children.cache.set(channel.id, makeCachePointer(Keyspaces.CHANNELS, 'global', channel.id))
      }
    }

    await this.client.internals.cache.forEach(
      Keyspaces.CHANNELS,
      this.guildId,
      'channelEntityKey',
      predicate
    )

    return this
  }
}
