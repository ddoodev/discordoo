import { EntitiesCacheManager } from '@src/api/managers'
import { DiscordRestApplication } from '@src/core'
import { Keyspaces } from '@src/constants'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesUtil, Guild, GuildEditOptions, GuildResolvable } from '@src/api'
import { attach, DiscordooError, guildChannelCreateDataToRaw, resolveGuildId, roleToRaw } from '@src/utils'
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
      roles: data.roles?.map(roleToRaw),
      channels: data.channels?.map(guildChannelCreateDataToRaw)
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

    const response = await this.app.internals.actions.createGuild(payload)

    if (response.success) {
      const Guild = EntitiesUtil.get('Guild')
      return await new Guild(this.app).init(response.result)
    }

    return undefined
  }

  async edit(
    guild: GuildResolvable,
    data: GuildEditData,
    options: GuildEditOptions
  ): Promise<Guild | undefined> {
    const id = resolveGuildId(guild)
    if (!id) throw new DiscordooError('ApplicationGuildsManager#edit', 'Cannot edit guild without guild id.')

    const payload = {}

    attach(payload, data, {
      props: [
        'name',
        'icon',
        [ 'verificationLevel', 'verification_level' ],
        [ 'defaultNotifications', 'default_message_notifications' ],
        [ 'explicitContentFilter', 'explicit_content_filter' ],
        [ 'afkChannelId', 'afk_channel_id' ],
        [ 'afkTimeout', 'afk_timeout' ],
        [ 'systemChannelId', 'system_channel_id' ],
        [ 'systemChannelFlags', 'system_channel_flags' ],
        [ 'rulesChannelId', 'rules_channel_id' ],
        [ 'publicUpdatesChannelId', 'public_updates_channel_id' ],
        [ 'preferredLocale', 'preferred_locale' ],
        'features',
        'description',
        'banner',
        'splash',
        'discoverySplash',
        [ 'ownerId', 'owner_id' ],
        [ 'widgetEnabled', 'widget_enabled' ],
        [ 'widgetChannelId', 'widget_channel_id' ],
        [ 'premiumProgressEnabled', 'premium_progress_bar_enabled' ],
        [ 'safetyAlertsChannelId', 'safety_alerts_channel_id' ]
      ]
    })

    const response = await this.app.internals.actions.editGuild(id, payload, options.reason)

    if (response.success) {
      const Guild = EntitiesUtil.get('Guild')

      if (options.patchEntity) {
        return await options.patchEntity.init(response.result)
      } else {
        return await new Guild(this.app).init(response.result)
      }
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
