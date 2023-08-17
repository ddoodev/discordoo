import { EntitiesCacheManager } from '@src/api/managers'
import { DiscordRestApplication } from '@src/core'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesUtil, Guild, GuildResolvable } from '@src/api'
import { attach, DiscordooError, resolveGuildId } from '@src/utils'
import { GuildCreateData } from '@src/api/entities/guild/interfaces/GuildCreateData'
import { RawGuildCreateData } from '@src/api/entities/guild/interfaces/RawGuildCreateData'
import { GuildEditData } from '@src/api/entities/guild/interfaces/GuildEditData'

export class ApplicationGuildsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Guild>

  constructor(app: DiscordRestApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<Guild>(this.app, {
      keyspace: Keyspaces.Guilds,
      storage: 'global',
      entity: 'Guild',
      policy: 'guilds'
    })
  }

  async create(data: GuildCreateData | RawGuildCreateData): Promise<Guild | undefined> {
    if (!data) {
      throw new DiscordooError('ApplicationGuildsManager#create', 'Cannot create guild without create data.')
    }

    const payload: RawGuildCreateData = {
      name: data.name,
    }

    attach(payload, data, {
      props: [
        'icon',
        [ 'verificationLevel', 'verification_level' ],
        [ 'defaultNotifications', 'default_message_notifications' ],
        [ 'explicitContentFilter', 'explicit_content_filter' ],
        'roles',
        'channels',
        [ 'afkChannelId', 'afk_channel_id' ],
        [ 'afkTimeout', 'afk_timeout' ],
        [ 'systemChannelId', 'system_channel_id' ]
      ]
    })

    const response = await this.app.internals.actions.createGuild(payload)

    if (response.success) {
      const Guild = EntitiesUtil.get('Guild')
      return await new Guild(this.app).init(response.result)
    }

    return undefined
  }

  async edit(
    guild: GuildResolvable,
    data: GuildEditData
  ): Promise<Guild | undefined> {
    const id = resolveGuildId(guild)
    if (!id) throw new DiscordooError('ApplicationGuildsManager#edit', 'Cannot edit guild without guild id.')

    const payload: RawGuildCreateData = {
      name: data.name,
    }

    attach(payload, data, {
      props: [
        'icon',
        [ 'verificationLevel', 'verification_level' ],
        [ 'defaultNotifications', 'default_message_notifications' ],
        [ 'explicitContentFilter', 'explicit_content_filter' ],
        [ 'afkChannelId', 'afk_channel_id' ],
        [ 'afkTimeout', 'afk_timeout' ],
        [ 'systemChannelId', 'system_channel_id' ]
      ]
    })

    const response = await this.app.internals.actions.editGuild(id, payload)

    if (response.success) {
      const Guild = EntitiesUtil.get('Guild')
      return await new Guild(this.app).init(response.result)
    }

    return undefined
  }

  async delete(guild: GuildResolvable): Promise<boolean> {
    const id = resolveGuildId(guild)
    if (!id) throw new DiscordooError('ApplicationGuildsManager#delete', 'Cannot delete guild without guild id.')

    const response = await this.app.internals.actions.deleteGuild(id)

    return response.success
  }

  async leave(guild: GuildResolvable): Promise<boolean> {
    const id = resolveGuildId(guild)
    if (!id) throw new DiscordooError('ApplicationGuildsManager#leave', 'Cannot leave guild without guild id.')

    const response = await this.app.internals.actions.leaveGuild(id)

    return response.success
  }
}
