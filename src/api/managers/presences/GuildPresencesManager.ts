import { EntitiesCacheManager, Presence } from '@src/api'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { GuildPresencesManagerData } from '@src/api/managers/presences/GuildPresencesManagerData'
import { DiscordooError, resolveGuildId } from '@src/utils'

export class GuildPresencesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Presence>
  public guildId: string

  constructor(client: Client, data: GuildPresencesManagerData) {
    super(client)

    const guildId = resolveGuildId(data.guild)
    if (!guildId) throw new DiscordooError('GuildPresencesManager', 'Cannot operate without guild id.')
    this.guildId = guildId

    this.cache = new EntitiesCacheManager<Presence>(this.client, {
      keyspace: Keyspaces.GUILD_PRESENCES,
      storage: this.guildId,
      entity: 'Presence',
      policy: 'presences'
    })
  }
}
