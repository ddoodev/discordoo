import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesCacheManager } from '@src/api'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { Client } from '@src/core'
import { CategoryChannelChildrensManagerData } from '@src/api/managers/channels/CategoryChannelChildrensManagerData'
import { channelEntityKey, DiscordooError, resolveChannelId } from '@src/utils'
import { Keyspaces } from '@src/constants'
import { GuildChannelCreateData } from '@src/api/entities/channel/interfaces/GuildChannelCreateData'
import { RawGuildChannelCreateData } from '@src/api/entities/channel/interfaces/RawGuildChannelCreateData'

export class CategoryChannelChildrensManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AnyGuildChannel>
  public categoryId: string
  public guildId: string

  constructor(client: Client, data: CategoryChannelChildrensManagerData) {
    super(client)

    const channelId = resolveChannelId(data.category)
    if (!channelId) throw new DiscordooError('CategoryChannelChildrensManager', 'Cannot operate without category channel id.')
    this.categoryId = channelId

    const guildId = resolveChannelId(data.category)
    if (!guildId) throw new DiscordooError('CategoryChannelChildrensManager', 'Cannot operate without guild id id.')
    this.guildId = guildId

    this.cache = new EntitiesCacheManager<AnyGuildChannel>(this.client, {
      keyspace: Keyspaces.CATEGORY_CHANNEL_CHILDRENS,
      storage: this.categoryId,
      entity: channelEntityKey,
      policy: 'channels'
    })
  }

  create<R = AnyGuildChannel>(data: GuildChannelCreateData | RawGuildChannelCreateData): Promise<R | undefined> {
    return this.client.channels.createGuildChannel<R>(this.guildId, { ...data, parentId: this.categoryId })
  }
}
