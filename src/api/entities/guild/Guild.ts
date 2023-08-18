import { Json, ToJsonProperties } from '@src/api/entities/interfaces'
import { attach, BufferResolvable, DiscordooError, resolveChannelId, resolveMemberId } from '@src/utils'
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
import { GuildApplicationCommandsManager, GuildChannelResolvable, GuildEditData, GuildMemberResolvable, RawGuildEditData } from '@src/api'
import {
  GuildDefaultMessageNotificationLevel,
  GuildExplicitContentFilterLevels,
  GuildFeatures,
  GuildVerificationLevels
} from '@src/constants'
import { GuildRolesManager } from '@src/api/managers/roles/GuildRolesManager'
import { GuildInvitesManager } from '@src/api/managers/invites/GuildInvitesManager'

export class Guild extends AbstractViewableGuild {
  public unavailable = false
  public declare members: GuildMembersManager
  public declare roles: GuildRolesManager
  public declare channels: GuildChannelsManager
  public declare presences: GuildPresencesManager
  public declare invites: GuildInvitesManager
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
      this.invites = new GuildInvitesManager(this.app, {
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

  async edit(data: GuildEditData | RawGuildEditData, reason?: string): Promise<this | undefined> {
    const success = await this.app.guilds.edit(this.id, data, { reason, patchEntity: this })

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

  async setName(name: string, reason?: string): Promise<this | undefined> {
    return this.edit({ name }, reason)
  }

  async setDescription(description: string, reason?: string): Promise<this | undefined> {
    return this.edit({ description }, reason)
  }

  async setPreferredLocale(preferredLocale: DiscordLocale, reason?: string): Promise<this | undefined> {
    return this.edit({ preferredLocale }, reason)
  }

  async setFeatures(features: GuildFeatures[], reason?: string): Promise<this | undefined> {
    return this.edit({ features }, reason)
  }

  async setOwner(owner: GuildMemberResolvable, reason?: string): Promise<this | undefined> {
    const ownerId = resolveMemberId(owner)
    if (!ownerId) throw new DiscordooError('Guild#setOwner', 'Cannot set owner without id.')

    return this.edit({ ownerId }, reason)
  }

  async setAfkChannel(afkChannel: GuildChannelResolvable, reason?: string): Promise<this | undefined> {
    const afkChannelId = resolveChannelId(afkChannel)
    if (!afkChannelId) throw new DiscordooError('Guild#setAfkChannel', 'Cannot set afk channel without id.')

    return this.edit({ afkChannelId }, reason)
  }

  async setAfkTimeout(afkTimeout: number, reason?: string): Promise<this | undefined> {
    return this.edit({ afkTimeout }, reason)
  }

  async setSystemChannel(systemChannel: GuildChannelResolvable, reason?: string): Promise<this | undefined> {
    const systemChannelId = resolveChannelId(systemChannel)
    if (!systemChannelId) throw new DiscordooError('Guild#setSystemChannel', 'Cannot set system channel without id.')

    return this.edit({ systemChannelId }, reason)
  }

  async setRulesChannel(rulesChannel: GuildChannelResolvable, reason?: string): Promise<this | undefined> {
    const rulesChannelId = resolveChannelId(rulesChannel)
    if (!rulesChannelId) throw new DiscordooError('Guild#setRulesChannel', 'Cannot set rules channel without id.')

    return this.edit({ rulesChannelId }, reason)
  }

  async setPublicUpdatesChannel(publicUpdatesChannel: GuildChannelResolvable, reason?: string): Promise<this | undefined> {
    const publicUpdatesChannelId = resolveChannelId(publicUpdatesChannel)
    if (!publicUpdatesChannelId) {
      throw new DiscordooError('Guild#setPublicUpdatesChannel', 'Cannot set public updates channel without id.')
    }

    return this.edit({ publicUpdatesChannelId }, reason)
  }

  async setSafetyAlertsChannel(safetyAlertsChannel: GuildChannelResolvable, reason?: string): Promise<this | undefined> {
    const safetyAlertsChannelId = resolveChannelId(safetyAlertsChannel)
    if (!safetyAlertsChannelId) {
      throw new DiscordooError('Guild#setSafetyAlertChannel', 'Cannot set safety alert channel without id.')
    }

    return this.edit({ safetyAlertsChannelId }, reason)
  }

  async setVerificationLevel(verificationLevel: GuildVerificationLevels, reason?: string): Promise<this | undefined> {
    return this.edit({ verificationLevel }, reason)
  }

  async setDefaultNotifications(defaultNotifications: GuildDefaultMessageNotificationLevel, reason?: string): Promise<this | undefined> {
    return this.edit({ defaultNotifications }, reason)
  }

  async setExplicitContentFilter(explicitContentFilter: GuildExplicitContentFilterLevels, reason?: string): Promise<this | undefined> {
    return this.edit({ explicitContentFilter }, reason)
  }

  async setPremiumProgressBarEnabled(enabled: boolean, reason?: string): Promise<this | undefined> {
    return this.edit({ premiumProgressEnabled: enabled }, reason)
  }

  async setIcon(icon: BufferResolvable, reason?: string): Promise<this | undefined> {
    return this.edit({ icon }, reason)
  }

  async setSplash(splash: BufferResolvable, reason?: string): Promise<this | undefined> {
    return this.edit({ splash }, reason)
  }

  async setBanner(banner: BufferResolvable, reason?: string): Promise<this | undefined> {
    return this.edit({ banner }, reason)
  }

  async setWidgetEnabled(enabled: boolean, reason?: string): Promise<this | undefined> {
    return this.edit({ widgetEnabled: enabled }, reason)
  }

  async setWidgetChannel(widgetChannel: GuildChannelResolvable, reason?: string): Promise<this | undefined> {
    const widgetChannelId = resolveChannelId(widgetChannel)
    if (!widgetChannelId) throw new DiscordooError('Guild#setWidgetChannel', 'Cannot set widget channel without id.')

    return this.edit({ widgetChannelId }, reason)
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
