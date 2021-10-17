import { EntitiesCacheManager } from '@src/api'
import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { Client } from '@src/core'
import { channelEntityKey } from '@src/utils'
import { ChannelDeleteOptions } from '@src/api/entities/channel/interfaces/ChannelDeleteOptions'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'

export class ClientChannelsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AbstractChannel>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<AbstractChannel>(this.client, {
      keyspace: 'channels',
      storage: 'global',
      entity: channelEntityKey,
      policy: 'channels'
    })
  }

  async delete(channelId: string, options: ChannelDeleteOptions = {}): Promise<any> { // TODO: RawChannelData
    return this.client.internals.actions.deleteChannel(channelId, options.reason)
  }

}

