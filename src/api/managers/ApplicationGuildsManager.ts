import { EntitiesCacheManager } from '@src/api/managers'
import { DiscordApplication } from '@src/core'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { Guild, GuildResolvable } from '@src/api'
import { DiscordooError, resolveGuildId } from '@src/utils'

export class ApplicationGuildsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Guild>

  constructor(app: DiscordApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<Guild>(this.app, {
      keyspace: Keyspaces.Guilds,
      storage: 'global',
      entity: 'Guild',
      policy: 'guilds'
    })
  }

  async leave(guild: GuildResolvable): Promise<boolean> {
    const id = resolveGuildId(guild)
    if (!id) throw new DiscordooError('ApplicationGuildsManager#leave', 'Cannot leave guild without guild id.')

    const response = await this.app.internals.actions.leaveGuild(id)

    return response.success
  }
}
