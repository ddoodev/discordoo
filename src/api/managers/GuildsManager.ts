import { EntitiesCacheManager } from '@src/api/managers'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { Guild, GuildResolvable } from '@src/api'
import { DiscordooError, resolveGuildId } from '@src/utils'

export class GuildsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Guild>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<Guild>(this.client, {
      keyspace: Keyspaces.GUILDS,
      storage: 'global',
      entity: 'Guild',
      policy: 'guilds'
    })
  }

  async leave(guild: GuildResolvable): Promise<boolean> {
    const id = resolveGuildId(guild)
    if (!id) throw new DiscordooError('GuildsManager#leave', 'Cannot leave guild without guild id.')

    const response = await this.client.internals.actions.leaveGuild(id)

    return response.success
  }
}
