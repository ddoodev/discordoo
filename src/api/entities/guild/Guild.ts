import { Json, ToJsonProperties } from '@src/api/entities/interfaces'
import { attach } from '@src/utils'
import { AbstractViewableGuild } from '@src/api/entities/guild/AbstractViewableGuild'
import { GuildMembersManager } from '@src/api/managers/members/GuildMembersManager'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { GuildChannelsManager } from '@src/api/managers/channels/GuildChannelsManager'
import { GuildPresencesManager } from '@src/api/managers/presences/GuildPresencesManager'
import { CacheManagerGetOptions } from '@src/cache'
import { GuildData } from '@src/api/entities/guild/interfaces/GuildData'
import { RawGuildData } from '@src/api/entities/guild/interfaces/RawGuildData'
import { DiscordLocale } from '@src/constants/common/DiscordLocale'
import { AnyGuildWritableChannel } from '@src/api/entities/channel/interfaces/AnyGuildWritableChannel'
import { GuildMember } from '@src/api/entities/member/GuildMember'
import { GuildApplicationCommandsManager, GuildEditData } from '@src/api'
import { GuildExplicitContentFilterLevels } from '@src/constants'
import { GuildRolesManager } from '@src/api/managers/roles/GuildRolesManager'
import { InviteGuildsManager } from '@src/api/managers/invites/InviteGuildsManager'

export class Guild extends AbstractViewableGuild {
  public unavailable = false
  public declare members: GuildMembersManager
  public declare roles: GuildRolesManager
  public declare channels: GuildChannelsManager
  public declare presences: GuildPresencesManager
  public declare invites: InviteGuildsManager
  public declare preferredLocale: DiscordLocale
  public declare rulesChannelId?: string
  public declare publicUpdatesChannelId?: string
  public declare systemChannelId?: string
  public declare ownerId: string
  public declare membersCount: number
  public declare commands: GuildApplicationCommandsManager
  public declare explicitContentFilter: GuildExplicitContentFilterLevels

  async init(data: GuildData | RawGuildData, options?: EntityInitOptions): Promise<this> {
    await super.init(data)

    attach(this, data, {
      props: [
        'unavailable',
        [ 'preferredLocale', 'preferred_locale' ],
        [ 'rulesChannelId', 'rules_channel_id' ],
        [ 'publicUpdatesChannelId', 'public_updates_channel_id' ],
        [ 'systemChannelId', 'system_channel_id' ],
        [ 'ownerId', 'owner_id' ],
        [ 'membersCount', 'members_count' ],
        [ 'explicitContentFilter', 'explicit_content_filter' ]
      ],
      disabled: options?.ignore,
      enabled: [ 'unavailable', 'ownerId' ]
    })

    if (!this.members) {
      this.members = new GuildMembersManager(this.app, {
        guild: this.id,
      })
    }

    if (!this.roles) {
      this.roles = new GuildRolesManager(this.app, {
        guild: this.id,
      })
    }

    if (!this.channels) {
      this.channels = new GuildChannelsManager(this.app, {
        guild: this.id,
      })
    }

    if (!this.presences) {
      this.presences = new GuildPresencesManager(this.app, {
        guild: this.id,
      })
    }

    if (!this.invites) {
      this.invites = new InviteGuildsManager(this.app, {
        guild: this.id,
      })
    }

    if (!this.commands) {
      this.commands = new GuildApplicationCommandsManager(this.app, {
        guild: this.id,
      })
    }

    return this
  }

  me(options?: CacheManagerGetOptions): Promise<GuildMember | undefined> {
    return this.members.cache.get(this.app.user.id, options)
  }

  async rulesChannel(options?: CacheManagerGetOptions): Promise<AnyGuildWritableChannel | undefined> {
    return this.rulesChannelId ? this.channels.cache.get<AnyGuildWritableChannel>(this.rulesChannelId, options) : undefined
  }

  async publicUpdatesChannel(options?: CacheManagerGetOptions): Promise<AnyGuildWritableChannel | undefined> {
    return this.publicUpdatesChannelId ? this.channels.cache.get<AnyGuildWritableChannel>(this.publicUpdatesChannelId, options) : undefined
  }

  async systemChannel(options?: CacheManagerGetOptions): Promise<AnyGuildWritableChannel | undefined> {
    return this.systemChannelId ? this.channels.cache.get<AnyGuildWritableChannel>(this.systemChannelId, options) : undefined
  }

  async edit(data: GuildEditData): Promise<this | undefined> {
    const success = await this.app.guilds.edit(this.id, data)

    return success ? this : undefined
  }

  async leave(): Promise<this | undefined> {
    const success = await this.app.guilds.leave(this.id)

    return success ? this : undefined
  }

  async delete(): Promise<this | undefined> {
    const success = await this.app.guilds.delete(this.id)

    return success ? this : undefined
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      unavailable: true,
      rulesChannelId: true,
      publicUpdatesChannelId: true,
      systemChannelId: true,
    }, obj)
  }
}
